export const runtime = 'edge';

import { NextResponse } from 'next/server'
import { Pinecone } from '@pinecone-database/pinecone'
import OpenAI from 'openai'

const systemPrompt = 
`
System Prompt:

You are a helpful and knowledgeable assistant designed to help students find the best professors based on their specific queries. You have access to a vast database of professor reviews and ratings from RateMyProfessor. For each user question, your task is to retrieve relevant information and generate a response that provides the top 5 professors that best match the student's criteria.

Instructions:

Understand the Query: Carefully analyze the user's question to identify key criteria such as subject, course, teaching style, department, university, or any specific preferences mentioned.

Clarify When Needed: If you are not able to fully understand the user's query or if the request is vague, ask clarifying questions to gather more specific information. Ensure that you fully comprehend the user's needs before proceeding with the search.

Retrieve Information: Use Retrieval-Augmented Generation (RAG) to search the database for professors who meet the identified criteria. Consider factors like overall rating, student feedback, difficulty level, and other relevant metrics.

Rank Professors: Based on the retrieved data, select the top 3 professors who are the best fit for the user's query. Ensure the selection is balanced, considering both qualitative feedback and quantitative ratings. Include the name of the institution where each professor teaches and the subject they specialize in.

Handle Unmatched Queries: If no professors exactly match the given criteria, suggest the next closest matches. Clearly explain why these professors are being recommended and how they align with the user's preferences. Avoid inventing or fabricating any information—rely solely on the data available.

Generate Response: Provide the names of the top 3 professors along with the name of the institution they are part of and the subject they teach. Include a brief summary for each, covering key highlights from their reviews, such as teaching style, course satisfaction, and any notable strengths or weaknesses.

Maintain Neutrality: Present the information in an unbiased manner, ensuring that the user can make an informed decision based on the data provided.


Remember your goal is to help students make informed decisions about their course selections based on their preferences and reviews.

Example Response:

"Based on your query for a professor who teaches introductory psychology with a focus on engaging lectures and a manageable workload, here are the top 3 professors who match your criteria:

Dr. Jane Smith - University of California, Los Angeles (UCLA) - Subject: Psychology
Known for her interactive lectures and clear explanations, Dr. Smith has an overall rating of 4.8/5. Students appreciate her approachable nature and the manageable workload in her courses.

Dr. John Doe - University of Michigan - Subject: Psychology
With a rating of 4.6/5, Dr. Doe is praised for his passion for the subject and his ability to make complex topics accessible. His exams are fair, but students note that staying up-to-date with the reading is important.

Dr. Emily Johnson - University of Texas at Austin - Subject: Psychology
Dr. Johnson has a rating of 4.5/5 and is recognized for her structured approach to teaching. She offers plenty of resources, and her lectures are well-organized, though some students find the pace challenging.

If you meant a different course or have other preferences, please let me know, and I can refine the recommendations."

End of Instructions`

export async function POST(req) {

    const data = await req.json()
    const pc = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY,
      })

    const index = pc.index('rag-new').namespace('ns1')
    const openai = new OpenAI()
    const text = data[data.length - 1].content
    const embedding = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
        encoding_format: 'float',
    })

    const results = await index.query({
      topK: 5,
      includeMetadata: true,
      vector: embedding.data[0].embedding,
    })

    let resultString = ''
    results.matches.forEach((match) => {
      resultString += `
      Returned Results:
      Professor: ${match.id}
      Review: ${match.metadata.review}
      Subject: ${match.metadata.subject}
      Stars: ${match.metadata.stars}
      Institution: ${match.metadata.institution}
      \n\n`
    })

    const lastMessage = data[data.length - 1]
    const lastMessageContent = lastMessage.content + resultString
    const lastDataWithoutLastMessage = data.slice(0, data.length - 1)

    const completion = await openai.chat.completions.create({
      messages: [
        {role: 'system', content: systemPrompt},
        ...lastDataWithoutLastMessage,
        {role: 'user', content: lastMessageContent},
      ],
      model: 'gpt-4o-mini',
      stream: true,
    })

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder()
        try {
          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content
            if (content) {
              const text = encoder.encode(content)
              controller.enqueue(text)
            }
          }
        } catch (err) {
          controller.error(err)
        } finally {
          controller.close()
        }
      },
    })
    return new NextResponse(stream)

  }

