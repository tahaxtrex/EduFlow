const OpenAI = require('openai');
const dotenv = require('dotenv');

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generates a complete course based on user responses.
 * Pipeline:
 * 1. Persona Summary
 * 2. Learning Objectives
 * 3. Module Structure
 * 4. Expand Lessons (Content, Examples, Analogies, Images, Graphs)
 * 5. Quizzes
 * 6. Final Project
 * 7. Summary & Glossary
 * 8. Usage Report
 */
async function generateCourse(userResponses) {
    console.log('Starting course generation for:', userResponses.topic);
    try {
        // Step 1: Persona Summary
        console.log('Step 1: Generating Persona...');
        const persona = await generatePersona(userResponses);
        console.log('Persona generated:', persona);

        // Step 2 & 3: Structure (Modules & Lessons titles)
        console.log('Step 2 & 3: Generating Structure...');
        const structure = await generateStructure(userResponses.topic, persona);
        console.log('Structure generated:', structure);

        // Step 4-7: Expand Lessons (Content generation)
        console.log('Step 4-7: Expanding Content...');
        const fullCourse = await expandCourseContent(structure, persona);
        console.log('Course expansion complete.');

        return fullCourse;
    } catch (error) {
        console.error('Error in generateCourse:', error);
        throw error;
    }
}

async function generatePersona(responses) {
    const prompt = `
    Analyze the following learner profile:
    Topic: ${responses.topic}
    Purpose: ${responses.purpose}
    Education Level: ${responses.education}
    Current Knowledge: ${responses.level}
    Learning Style: ${responses.style}
    
    Create a "Persona Summary" JSON object with:
    - summary: A brief description of the learner.
    - tone: Recommended tone (e.g., "Encouraging and simple" or "Academic and rigorous").
    - complexity: Level (Beginner, Intermediate, Advanced).
  `;

    const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: "You are an expert pedagogical analyst." }, { role: "user", content: prompt }],
        model: "gpt-4o",
        response_format: { type: "json_object" },
    });

    return JSON.parse(completion.choices[0].message.content);
}

async function generateStructure(topic, persona) {
    const prompt = `
    Create a course structure for "${topic}" tailored to this persona: ${JSON.stringify(persona)}.
    
    Output a JSON object with:
    - title: Creative course title.
    - description: Course overview.
    - modules: Array of objects { title: "Module Title", lessons: [ { title: "Lesson Title" } ] }
    
    Limit to 3 modules, with max 3 lessons each. a max of 7 lessons overall.
  `;

    const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: "You are an expert curriculum designer." }, { role: "user", content: prompt }],
        model: "gpt-4o",
        response_format: { type: "json_object" },
    });

    return JSON.parse(completion.choices[0].message.content);
}

async function expandCourseContent(structure, persona) {
    // We will iterate through modules and lessons to generate content.
    // For efficiency, we'll process modules in parallel or sequence.

    const expandedModules = [];

    for (const [mIndex, module] of structure.modules.entries()) {
        console.log(`Processing Module ${mIndex + 1}/${structure.modules.length}: ${module.title}`);
        const expandedLessons = [];
        for (const [lIndex, lesson] of module.lessons.entries()) {
            console.log(`  Generating Lesson ${lIndex + 1}/${module.lessons.length}: ${lesson.title}`);
            try {
                const lessonContent = await generateLessonContent(lesson.title, module.title, structure.title, persona);
                expandedLessons.push({ ...lesson, ...lessonContent });
                console.log(`  Lesson completed: ${lesson.title}`);
            } catch (error) {
                console.error(`  Failed to generate lesson ${lesson.title}:`, error);
                // Fallback or rethrow? For now, rethrow to see the error.
                throw error;
            }
        }
        expandedModules.push({ ...module, lessons: expandedLessons });
    }

    // Generate Final Project & Glossary
    console.log('Generating Extras (Project & Glossary)...');
    const extras = await generateExtras(structure.title, persona);
    console.log('Extras generated.');

    return {
        ...structure,
        modules: expandedModules,
        ...extras,
        persona: persona
    };
}

async function generateLessonContent(lessonTitle, moduleTitle, courseTitle, persona) {
    const prompt = `
    Generate a COMPREHENSIVE and DETAILED lesson for:
    Course: ${courseTitle}
    Module: ${moduleTitle}
    Lesson: ${lessonTitle}
    Target Audience: ${persona.summary} (${persona.complexity})
    
    Instructions:
    1. Explanation: Deep, educational, but USER-FRIENDLY and FUN. Avoid long walls of text. Use clear paragraphs. Prioritize clarity and accuracy.
    2. Formatting: 
       - Use standard Markdown.
       - **Bold** key terms.
       - Put Math formulas in LaTeX format inside $$ ... $$ blocks.
       - Put Code snippets in \`\`\`language ... \`\`\` blocks.
       - Use bullet points for lists.
       - Use tables for tabular data.
       - Use images for visual data.
       - Use graphs for data visualization.
    3. Tone: ${persona.tone}
    
    Output JSON with:
    - explanation: The main lesson content (Markdown supported).
    - examples: Array of strings (2 distinct, detailed real-world examples).
    - analogies: Array of strings (2 creative analogies to explain complex concepts).
    - images: Array of objects { prompt: "Image generation prompt", caption: "Caption" }.
    - graphs: Array of objects { type: "bar" | "line" | "pie", title: "Graph Title", data: [{name: "Label", value: 10}, ...] }.
    - quiz: Array of 2 objects { question: "", options: ["A", "B", "C", "D"], correct: 0, explanation: "Why this is correct" }.
  `;

    const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: "You are an expert teacher." }, { role: "user", content: prompt }],
        model: "gpt-4o",
        response_format: { type: "json_object" },
    });

    return JSON.parse(completion.choices[0].message.content);
}

async function generateExtras(courseTitle, persona) {
    const prompt = `
    Generate a Final Project, Glossary, and Final Assessment for the course "${courseTitle}".
    Target Audience: ${persona.complexity}
    
    Output JSON with:
    - project: { title: "", description: "", steps: [] }
    - glossary: Array of { term: "", definition: "" }
    - finalAssessment: Array of 5 objects { question: "", options: ["A", "B", "C", "D"], correct: 0, explanation: "" }
    - usage_report: { tokens_used: "Estimated", generation_time: "Estimated" }
  `;

    const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: "You are an expert educational content creator." }, { role: "user", content: prompt }],
        model: "gpt-4o",
        response_format: { type: "json_object" },
    });

    return JSON.parse(completion.choices[0].message.content);
}

module.exports = { generateCourse };
