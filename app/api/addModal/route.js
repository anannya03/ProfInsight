import { NextResponse } from 'next/server';
import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';
import axios from 'axios';
import * as cheerio from 'cheerio';

// Initialize OpenAI and Pinecone clients
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const index = pinecone.index('rag-new').namespace('ns1');

export async function POST(req) {
    try {
        const { profPage } = await req.json();
        console.log('Received URL:', profPage);

        // Validate the URL
        const isValidUrl = /^https:\/\/www\.ratemyprofessors\.com\/professor\/\d+$/.test(profPage);
        if (!isValidUrl) {
            return NextResponse.json({ error: 'Invalid RateMyProfessor URL.' }, { status: 400 });
        }

        // Fetch the HTML content of the page
        const response = await axios.get(profPage);
        const htmlContent = response.data;

        // Load HTML content into cheerio
        const $ = cheerio.load(htmlContent);

        // Extract professor information
        const firstName = $('.NameTitle__Name-dowf0z-0.cfjPUG span').first().text().trim() || 'Unknown';
        const lastName = $('.NameTitle__Name-dowf0z-0.cfjPUG span').last().text().trim() || 'Unknown';
        const professorName = `${firstName} ${lastName}`;
        const stars = parseFloat($('.RatingValue__Numerator-qw8sqy-2.LiyuV').text().trim()) || 0;
        const department = $('.TeacherDepartment__StyledDepartmentLink-fl79e8-0.iMmVHb b').text().trim() || 'Unknown';
        const institution = $('.NameTitle__Title-dowf0z-1.iLYGwn a').text().trim() || 'Unknown';

        // Extract and combine reviews
        const reviews = [];
        $('#ratingsList li').each((i, elem) => {
            const reviewText = $(elem).find('.Comments__StyledComments-dzzyvm-0.gRjWel').text().trim();
            if (reviewText) {
                reviews.push(reviewText);
            }
        });

        // Default message if no reviews are found
        const cumulativeReview = reviews.length > 0 ? reviews.join(' ') : 'No current review, but worth a try taking the course.';

        // Use OpenAI to summarize the reviews
        let summarizedReview = cumulativeReview;
        if (reviews.length > 0) {
            const summaryResponse = await openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: 'You are a helpful assistant who summarizes student reviews for professors. Please summarize the following reviews and highlight the overall pros and cons of the class.' },
                    { role: 'user', content: cumulativeReview },
                ],
            });
            summarizedReview = summaryResponse.choices[0].message.content.trim();
        }

        // Generate an embedding for the summarized review
        const embeddingResponse = await openai.embeddings.create({
            model: 'text-embedding-3-small',  // Use the appropriate embedding model for your index
            input: [summarizedReview],
        });

        const reviewEmbedding = embeddingResponse.data[0].embedding;

        // Check and log the embedding size
        const embeddingSize = reviewEmbedding.length;
        console.log('Embedding Dimension:', embeddingSize);

        // Ensure the embedding size matches the expected dimension
        if (embeddingSize !== 1536) {
            throw new Error(`Unexpected embedding dimension: ${embeddingSize}. Expected: 1536.`);
        }

        // Prepare the record to be inserted into Pinecone
        const vectors = [
            {
                id: professorName,
                values: reviewEmbedding,
                metadata: {
                    review: summarizedReview,
                    subject: department,
                    stars: stars,
                    institution: institution,
                },
            },
        ];
        
        try {
            const upsertResponse = await index.namespace('ns1').upsert(vectors);  // Directly pass the vectors array
            console.log("Upsert successful:", JSON.stringify(upsertResponse, null, 2));
            return NextResponse.json({ message: 'Professor successfully added', data: vectors });
        } catch (error) {
            console.error("Error during upsert:", error.message);
            return NextResponse.json({ error: 'Failed to upsert data to Pinecone.', status: 500 });
        }

    } catch (error) {
        console.error('Unexpected error:', error.message);
        return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
    }
}
