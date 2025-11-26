export const sampleCourse = {
    "title": "Machine Learning: The Brain in the Machine 🧠",
    "description": "A fun, interactive journey into how computers learn, designed for high schoolers who want to build the future.",
    "intro": {
        "title": "Welcome, Explorer! 🚀",
        "content": "## Your Journey Begins Here\n\nWelcome to the **Sample Track**! This isn't your boring old textbook. We're going to explore the wild world of Artificial Intelligence using **interactive experiments**, **fun analogies**, and **real-world magic**.\n\n### What You'll Discover:\n*   How computers \"see\" the world 👀\n*   How to teach a machine like a puppy 🐶\n*   The secret math behind the magic ✨\n\nNo heavy math required—just bring your curiosity!",
        "videoUrl": "https://www.youtube.com/embed/f_uwKZIAeM0"
    },
    "modules": [
        {
            "id": "mod1",
            "title": "Module 1: What is this Sorcery? 🧙‍♂️",
            "lessons": [
                {
                    "id": "les1",
                    "title": "The Lazy Programmer",
                    "content": {
                        "explanation": "## Coding vs. Learning\n\nImagine you want to teach a computer to tell the difference between a **cat** and a **dog**. \n\nIn the **Old Way (Traditional Programming)**, you'd have to write thousands of rules: \n* \"If it has pointy ears...\"\n* \"If it has whiskers...\"\n* \"If it barks...\"\n\nBut what about a cat that barks? Or a dog with floppy ears? You'd be writing rules forever! 😫\n\n**Machine Learning (ML)** is the \"lazy\" (smart) way. Instead of writing rules, you just show the computer thousands of pictures of cats and dogs and say, \"Figure it out yourself.\" \n\nThe computer looks at the data, finds its own patterns, and writes its own rules. It's like magic, but it's actually just **math**.\n\n> **Fun Fact:** 🤯 The first computer program was written by Ada Lovelace in 1843, over 100 years before the first electronic computer was built!\n\n### Try This! 🧪\nLook at a chair. How would you describe it to an alien using only rules? \"It has 4 legs\"? (What about a beanbag?) \"It has a back\"? (What about a stool?) It's hard, right? That's why we need ML!",
                        "analogies": [
                            "**The Recipe:** Traditional programming is like following a strict recipe. ML is like tasting a dish and figuring out the recipe yourself.",
                            "**The Dog Trick:** Traditional programming is building a robot dog and programming every joint movement. ML is getting a real dog and giving it treats when it sits."
                        ],
                        "examples": [
                            "**Netflix Recommendations:** Netflix doesn't have a rule that says \"If user likes Action, show Batman.\" It learns from millions of users that people who watched \"The Dark Knight\" also liked \"Inception\".",
                            "**Spam Filters:** Your email doesn't have a list of every scammer. It learns that emails with \"WIN A MILLION DOLLARS\" usually mean trouble."
                        ],
                        "graphs": [
                            {
                                "type": "bar",
                                "title": "Time Spent Coding Rules vs. Training Models",
                                "data": [
                                    { "name": "Traditional", "value": 100 },
                                    { "name": "Machine Learning", "value": 20 }
                                ]
                            }
                        ],
                        "quiz": [
                            {
                                "question": "What is the main difference between traditional programming and ML?",
                                "options": [
                                    "ML uses more electricity",
                                    "Traditional programming requires data",
                                    "ML learns rules from data instead of being explicitly programmed",
                                    "Traditional programming is faster"
                                ],
                                "correct": 2,
                                "explanation": "Correct! ML figures out the rules by looking at examples (data)."
                            }
                        ]
                    }
                },
                {
                    "id": "les2",
                    "title": "How Machines \"See\" 👀",
                    "content": {
                        "explanation": "## It's All Numbers\n\nComputers don't have eyes. They see the world as a giant grid of **numbers**.\n\nTake a black-and-white photo of a number **8**. To a computer, that's just a grid of pixels. \n* 0 = Black\n* 255 = White\n* Everything in between is gray.\n\nWhen an ML model \"looks\" at a picture, it's actually doing math on these numbers to find **features**—like curves, straight lines, or edges.\n\n> **Fun Fact:** 📸 The first digital camera was invented in 1975. It weighed 8 pounds and took 23 seconds to record a single black-and-white image!\n\n### Try This! 🧪\nZoom in really close on a photo on your phone. Can you see the tiny colored squares? Those are pixels! Your phone combines millions of them to trick your eye into seeing a smooth image.",
                        "analogies": [
                            "**Paint by Numbers:** Imagine a paint-by-numbers book, but instead of painting, you're just looking at the list of numbers to guess what the picture is.",
                            "**The Matrix:** Like Neo seeing the code behind the reality, ML sees the matrix of pixel values behind the image."
                        ],
                        "examples": [
                            "**FaceID:** Your phone turns your face into a mathematical map of features (distance between eyes, nose shape) to unlock.",
                            "**Self-Driving Cars:** They see the road as a stream of numbers from cameras and LIDAR sensors to detect lanes and pedestrians."
                        ],
                        "graphs": [
                            {
                                "type": "line",
                                "title": "Accuracy of Vision Models Over Time",
                                "data": [
                                    { "name": "2010", "value": 70 },
                                    { "name": "2015", "value": 85 },
                                    { "name": "2020", "value": 98 },
                                    { "name": "2025", "value": 99.9 }
                                ]
                            }
                        ],
                        "quiz": [
                            {
                                "question": "How does a computer represent an image?",
                                "options": [
                                    "As a grid of numbers (pixels)",
                                    "As a tiny photograph inside the chip",
                                    "It uses magic",
                                    "It describes it in English"
                                ],
                                "correct": 0,
                                "explanation": "Exactly! Images are just grids of pixel values (numbers) to a computer."
                            }
                        ]
                    }
                }
            ]
        },
        {
            "id": "mod2",
            "title": "Module 2: Training Day 🏋️‍♀️",
            "lessons": [
                {
                    "id": "les3",
                    "title": "The Teacher (Supervised Learning)",
                    "content": {
                        "explanation": "## Learning with Labels\n\n**Supervised Learning** is the most common type of ML. It's like having a teacher standing over your shoulder.\n\n1. **Input:** You show the computer a picture.\n2. **Guess:** The computer guesses \"Cat!\"\n3. **Correction:** The teacher says \"No, that's a toaster.\"\n4. **Adjustment:** The computer tweaks its brain slightly so it won't make that mistake again.\n\nWe call the correct answers **Labels**. The goal is to map Inputs -> Labels.",
                        "analogies": [
                            "**Flashcards:** It's exactly like studying with flashcards. You look at the front (Input), guess, and check the back (Label).",
                            "**Cooking Class:** The chef shows you exactly how to make the dish, and you try to copy it."
                        ],
                        "examples": [
                            "**Spam Detection:** Emails are labeled as \"Spam\" or \"Not Spam\". The model learns to separate them.",
                            "**Medical Diagnosis:** X-rays are labeled \"Healthy\" or \"Fracture\". The model learns to spot the breaks."
                        ],
                        "graphs": [
                            {
                                "type": "pie",
                                "title": "Types of ML Used in Industry",
                                "data": [
                                    { "name": "Supervised", "value": 70 },
                                    { "name": "Unsupervised", "value": 20 },
                                    { "name": "Reinforcement", "value": 10 }
                                ]
                            }
                        ],
                        "quiz": [
                            {
                                "question": "What is essential for Supervised Learning?",
                                "options": [
                                    "A fast internet connection",
                                    "Labeled data (Answers)",
                                    "A robot body",
                                    "Unlabeled data"
                                ],
                                "correct": 1,
                                "explanation": "Spot on! Supervised learning needs the 'correct answers' or labels to learn."
                            }
                        ]
                    }
                },
                {
                    "id": "les4",
                    "title": "The Explorer (Unsupervised Learning)",
                    "content": {
                        "explanation": "## Finding Patterns in Chaos\n\nWhat if you don't have labels? What if you just have a giant pile of data?\n\n**Unsupervised Learning** is like being dropped on an alien planet. You don't know the names of anything, but you can start to group things that look similar.\n\n* \"These things are green and leafy.\" (Plants)\n* \"These things are grey and hard.\" (Rocks)\n\nThe computer looks for **Clusters** and **Patterns** without being told what they are.",
                        "analogies": [
                            "**The Martian Librarian:** Imagine organizing a library of books written in an alien language. You can't read them, but you can group them by cover color or size.",
                            "**Sorting Laundry:** You separate clothes into piles (lights, darks, socks) without reading the tags."
                        ],
                        "examples": [
                            "**Customer Segmentation:** A store groups customers by buying habits (\"Weekend Shoppers\", \"Bargain Hunters\") without knowing them personally.",
                            "**Recommendation Engines:** Spotify notices that people who listen to heavy metal also tend to listen to... classical music? (It happens!)"
                        ],
                        "graphs": [],
                        "quiz": [
                            {
                                "question": "What is the goal of Unsupervised Learning?",
                                "options": [
                                    "To predict the future",
                                    "To find hidden patterns or groups in data",
                                    "To play chess",
                                    "To label images correctly"
                                ],
                                "correct": 1,
                                "explanation": "Correct! It's all about discovering structure in unlabeled data."
                            }
                        ]
                    }
                }
            ]
        },
        {
            "id": "mod3",
            "title": "Module 3: Neural Networks 🧠",
            "lessons": [
                {
                    "id": "les5",
                    "title": "The Digital Brain",
                    "content": {
                        "explanation": "## Inspired by Biology\n\n**Neural Networks** are the heavy hitters of AI. They are loosely inspired by the human brain.\n\n* **Neurons:** Tiny nodes that hold a number.\n* **Layers:** Neurons are organized in layers. Input -> Hidden -> Output.\n* **Weights:** The connections between neurons. Stronger connection = higher weight.\n\nThink of it as a **voting system**. Each neuron votes on what it thinks it sees. If enough neurons in the first layer shout \"I see a curve!\", the neurons in the next layer say \"Aha! A circle!\"",
                        "analogies": [
                            "**The Bucket Brigade:** Imagine a line of people passing buckets of water. Some have big buckets (high weight), some have holes (low weight). The amount of water that reaches the end is the answer.",
                            "**The Committee:** A huge committee making a decision. Sub-committees vote on small details, passing their results up to the bosses."
                        ],
                        "examples": [
                            "**ChatGPT:** A massive neural network (Transformer) that predicts the next word in a sentence.",
                            "**DeepFakes:** Neural networks generating realistic faces that don't exist."
                        ],
                        "graphs": [
                            {
                                "type": "line",
                                "title": "Network Complexity vs. Performance",
                                "data": [
                                    { "name": "1 Layer", "value": 20 },
                                    { "name": "2 Layers", "value": 45 },
                                    { "name": "Deep Network", "value": 95 }
                                ]
                            }
                        ],
                        "quiz": [
                            {
                                "question": "What are the connections between neurons called?",
                                "options": [
                                    "Strings",
                                    "Weights",
                                    "Cables",
                                    "Synapses"
                                ],
                                "correct": 1,
                                "explanation": "Right! Weights determine the strength of the signal passing between neurons."
                            }
                        ]
                    }
                }
            ]
        }
    ],
    "finalAssessment": [
        {
            "question": "Which type of learning requires labeled data?",
            "options": ["Unsupervised", "Supervised", "Reinforcement", "Magic"],
            "correct": 1,
            "explanation": "Supervised learning needs labels (answers) to train."
        },
        {
            "question": "What does a computer 'see' when it looks at an image?",
            "options": ["A picture", "A grid of numbers", "Colors", "Shapes"],
            "correct": 1,
            "explanation": "Computers interpret images as matrices of pixel values (numbers)."
        },
        {
            "question": "What is a Neural Network inspired by?",
            "options": ["The human brain", "A spider web", "A computer chip", "A tree"],
            "correct": 0,
            "explanation": "Neural networks are biologically inspired by the way neurons connect in the brain."
        },
        {
            "question": "In the 'Lazy Programmer' analogy, what does ML do?",
            "options": ["Writes rules manually", "Figures out rules from data", "Copies code from StackOverflow", "Sleeps"],
            "correct": 1,
            "explanation": "ML algorithms learn the rules by analyzing patterns in data."
        },
        {
            "question": "What is an example of Unsupervised Learning?",
            "options": ["Spam Filter", "FaceID", "Customer Segmentation (Clustering)", "Teaching a dog to sit"],
            "correct": 2,
            "explanation": "Clustering customers groups them by similarity without knowing who they are beforehand."
        }
    ]
};
