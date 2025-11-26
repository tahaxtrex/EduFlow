export const advancedCourse = {
    "title": "Theoretical Foundations of Machine Learning 🎓",
    "description": "A rigorous exploration of statistical learning theory, optimization landscapes, and attention mechanisms for postgraduate research.",
    "intro": {
        "title": "Welcome, Researcher",
        "content": "## The Frontier of Intelligence\n\nYou are about to embark on a rigorous intellectual journey into the mathematical foundations of machine intelligence. This track is designed for those who seek not just to *use* tools, but to *understand* the fundamental theorems that make them possible.\n\nWe will move beyond the 'black box' abstraction and dissect the statistical guarantees of learning, the geometry of high-dimensional optimization landscapes, and the linear algebra governing attention mechanisms.\n\n**Prerequisites:**\n* Multivariate Calculus\n* Linear Algebra\n* Probability Theory\n\nPrepare your mind. The deeper you look, the more fascinating it becomes.",
        "videoUrl": "https://www.youtube.com/embed/aircAruvnKk"
    },
    "modules": [
        {
            "id": "adv_mod1",
            "title": "Module 1: Statistical Learning Theory",
            "lessons": [
                {
                    "id": "adv_les1",
                    "title": "PAC Learning Framework",
                    "content": {
                        "explanation": "## Probably Approximately Correct (PAC) Learning\n\nIntroduced by Leslie Valiant (1984), the PAC framework formalizes the concept of learnability. A hypothesis class $\\mathcal{H}$ is PAC-learnable if there exists an algorithm $\\mathcal{A}$ and a polynomial function $poly(\\cdot, \\cdot, \\cdot, \\cdot)$ such that for any $\\epsilon > 0$ and $\\delta > 0$, for all distributions $\\mathcal{D}$ over $\\mathcal{X}$ and for all target concepts $c \\in \\mathcal{H}$:\n\n$$ P_{S \\sim \\mathcal{D}^m} [R(h_S) \\leq \\epsilon] \\geq 1 - \\delta $$\n\nwhere $m \\geq poly(1/\\epsilon, 1/\\delta, size(c), size(\\mathcal{X}))$. \n\nHere, $R(h_S)$ represents the generalization error (risk) of the hypothesis $h_S$ selected by the algorithm.\n\n### Key Implications\n* **Sample Complexity:** The number of samples $m$ required grows polynomially with the inverse of the error parameter $\\epsilon$ and confidence parameter $\\delta$.\n* **Agnostic PAC Learning:** Extends the framework to cases where the target concept $c$ may not be in $\\mathcal{H}$, introducing the approximation error term.",
                        "analogies": [
                            "**The Exam Preparation:** Imagine preparing for an exam where you don't know the questions (distribution $\\mathcal{D}$). PAC guarantees that if you study enough past papers (samples $m$), the probability (confidence $1-\\delta$) that you fail (error $> \\epsilon$) is very low.",
                            "**Quality Control:** In manufacturing, checking a random sample of products allows you to assert with high confidence that the defect rate of the entire batch is below a certain threshold."
                        ],
                        "examples": [
                            "**Boolean Conjunctions:** Learning a conjunction of boolean literals is PAC-learnable.",
                            "**Linear Threshold Functions:** In $\\mathbb{R}^d$, these are PAC-learnable efficiently."
                        ],
                        "graphs": [
                            {
                                "type": "line",
                                "title": "Sample Complexity vs. Error Tolerance (ε)",
                                "data": [
                                    { "name": "0.1", "value": 100 },
                                    { "name": "0.05", "value": 200 },
                                    { "name": "0.01", "value": 1000 },
                                    { "name": "0.001", "value": 10000 }
                                ]
                            }
                        ],
                        "quiz": [
                            {
                                "question": "What does the 'Probably' in PAC refer to?",
                                "options": [
                                    "The probability that the error is small (confidence parameter δ)",
                                    "The probability that the algorithm halts",
                                    "The probability that the data is correct",
                                    "The probability that the model overfits"
                                ],
                                "correct": 0,
                                "explanation": "It refers to the confidence $1-\\delta$ that the learned hypothesis has a generalization error less than $\\epsilon$."
                            }
                        ]
                    }
                },
                {
                    "id": "adv_les2",
                    "title": "VC Dimension & Structural Risk Minimization",
                    "content": {
                        "explanation": "## Vapnik-Chervonenkis (VC) Dimension\n\nThe VC dimension of a hypothesis class $\\mathcal{H}$, denoted $VC(\\mathcal{H})$, is the maximum size of a set $S \\subset \\mathcal{X}$ that can be **shattered** by $\\mathcal{H}$. \n\n$$ VC(\\mathcal{H}) = \\max \\{ |S| : S \\subseteq \\mathcal{X}, \\mathcal{H} \\text{ shatters } S \\} $$\n\nIf $\\mathcal{H}$ can shatter sets of arbitrarily large size, then $VC(\\mathcal{H}) = \\infty$.\n\n### Fundamental Theorem of Statistical Learning\nA binary hypothesis class $\\mathcal{H}$ is PAC-learnable if and only if $VC(\\mathcal{H}) < \\infty$. The sample complexity is tightly bounded by:\n\n$$ m \\geq C \\frac{VC(\\mathcal{H}) + \\log(1/\\delta)}{\\epsilon} $$\n\n### Structural Risk Minimization (SRM)\nSRM balances empirical risk with model complexity (capacity) to prevent overfitting:\n\n$$ h_{SRM} = \\arg\\min_{h \\in \\mathcal{H}} \\left( \\hat{R}(h) + \\sqrt{\\frac{VC(\\mathcal{H}) (\\log(2m/VC(\\mathcal{H})) + 1) + \\log(4/\\delta)}{m}} \\right) $$",
                        "analogies": [
                            "**Falsifiability:** Think of VC dimension as the 'falsifiability' of a theory. A theory that can explain *any* possible observation (shatter any set) is not scientific (not learnable) because it can't be proven wrong by data.",
                            "**Polynomial Curve Fitting:** A polynomial of degree $d$ has $d+1$ parameters. It can perfectly fit (shatter) $d+1$ points. If you have fewer points than parameters, you can fit anything (overfitting)."
                        ],
                        "examples": [
                            "**Linear Classifiers:** In $\\mathbb{R}^d$, the VC dimension is $d+1$.",
                            "**Sine Functions:** The class of functions $\\sin(\\alpha x)$ has infinite VC dimension."
                        ],
                        "graphs": [
                            {
                                "type": "line",
                                "title": "Generalization Error vs. Model Complexity (VC Dim)",
                                "data": [
                                    { "name": "Low", "value": 0.4 },
                                    { "name": "Optimal", "value": 0.1 },
                                    { "name": "High", "value": 0.6 }
                                ]
                            }
                        ],
                        "quiz": [
                            {
                                "question": "If a hypothesis class has infinite VC dimension, is it PAC-learnable?",
                                "options": [
                                    "Yes, always",
                                    "No, never",
                                    "Only with infinite data",
                                    "Depends on the learning rate"
                                ],
                                "correct": 1,
                                "explanation": "Finite VC dimension is a necessary and sufficient condition for PAC learnability in the binary classification setting."
                            }
                        ]
                    }
                }
            ]
        },
        {
            "id": "adv_mod2",
            "title": "Module 2: Deep Learning Theory",
            "lessons": [
                {
                    "id": "adv_les3",
                    "title": "Optimization Landscapes & Saddle Points",
                    "content": {
                        "explanation": "## Non-Convex Optimization\n\nDeep neural networks involve optimizing highly non-convex loss functions. Unlike convex optimization where any local minimum is global, deep learning landscapes are riddled with critical points where $\\nabla L(\\theta) = 0$.\n\n### The Saddle Point Problem\nIn high-dimensional spaces, most critical points are **saddle points**, not local minima. A saddle point is a minimum in some directions and a maximum in others. \n\nThe ratio of saddle points to local minima grows exponentially with dimensionality $N$. \n\n$$ \\frac{\\text{Number of Saddle Points}}{\\text{Number of Local Minima}} \\propto e^N $$\n\nHowever, Stochastic Gradient Descent (SGD) with noise can escape saddle points efficiently.",
                        "analogies": [
                            "**Mountain Pass:** A saddle point is like a mountain pass. It's the lowest point between two peaks (maxima) but the highest point between two valleys (minima).",
                            "**Horse Saddle:** The shape literally resembles a horse saddle. It curves up in the front/back and down on the sides."
                        ],
                        "examples": [
                            "**ResNets:** Residual connections smooth the optimization landscape, making it easier for SGD to find good minima.",
                            "**Mode Connectivity:** Recent research shows that different local minima found by SGD are often connected by low-loss paths."
                        ],
                        "graphs": [],
                        "quiz": [
                            {
                                "question": "In high dimensions, what is the most common type of critical point?",
                                "options": [
                                    "Global Minimum",
                                    "Local Minimum",
                                    "Saddle Point",
                                    "Global Maximum"
                                ],
                                "correct": 2,
                                "explanation": "Saddle points dominate the optimization landscape in high-dimensional non-convex problems."
                            }
                        ]
                    }
                },
                {
                    "id": "adv_les4",
                    "title": "Attention Mechanisms & Transformers",
                    "content": {
                        "explanation": "## The Mathematics of Attention\n\nThe core of the Transformer architecture is the **Scaled Dot-Product Attention** mechanism. Given queries $Q$, keys $K$, and values $V$:\n\n$$ \\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V $$\n\n### Why Scaled?\nThe dot products $QK^T$ can grow large in magnitude for large $d_k$, pushing the softmax function into regions where gradients are extremely small (vanishing gradients). Scaling by $1/\\sqrt{d_k}$ counteracts this.\n\n### Multi-Head Attention\nAllows the model to jointly attend to information from different representation subspaces at different positions.\n\n$$ \\text{MultiHead}(Q, K, V) = \\text{Concat}(\\text{head}_1, ..., \\text{head}_h)W^O $$\n\nwhere $\\text{head}_i = \\text{Attention}(QW_i^Q, KW_i^K, VW_i^V)$.",
                        "analogies": [
                            "**Database Retrieval:** Think of $Q$ as your search query, $K$ as the database keys (metadata), and $V$ as the actual content. You match query to keys to retrieve a weighted sum of values.",
                            "**Cocktail Party Effect:** You focus (attend) on one conversation (high weight) while tuning out others (low weight), based on relevance (dot product similarity)."
                        ],
                        "examples": [
                            "**BERT:** Uses bidirectional self-attention to understand context from both left and right.",
                            "**GPT:** Uses masked self-attention to generate text autoregressively."
                        ],
                        "graphs": [
                            {
                                "type": "bar",
                                "title": "Computational Complexity per Layer",
                                "data": [
                                    { "name": "RNN (Sequential)", "value": 100 },
                                    { "name": "Transformer (Parallel)", "value": 20 }
                                ]
                            }
                        ],
                        "quiz": [
                            {
                                "question": "Why do we divide by sqrt(d_k) in the attention formula?",
                                "options": [
                                    "To make the calculation faster",
                                    "To prevent vanishing gradients in softmax",
                                    "To normalize the batch size",
                                    "It's an arbitrary constant"
                                ],
                                "correct": 1,
                                "explanation": "It prevents the dot products from getting too large, which would push softmax into saturation regions with near-zero gradients."
                            }
                        ]
                    }
                }
            ]
        }
    ],
    "finalAssessment": [
        {
            "question": "Which condition is necessary for a hypothesis class to be PAC-learnable?",
            "options": ["Infinite VC Dimension", "Finite VC Dimension", "Zero Training Error", "Convex Loss Function"],
            "correct": 1,
            "explanation": "Finite VC dimension is the fundamental requirement for learnability."
        },
        {
            "question": "What is the primary benefit of Multi-Head Attention?",
            "options": ["Reduces parameter count", "Allows attending to different representation subspaces", "Eliminates the need for positional encoding", "Speeds up training"],
            "correct": 1,
            "explanation": "It allows the model to capture different types of relationships (e.g., syntax vs. semantics) simultaneously."
        },
        {
            "question": "In high-dimensional optimization, what is the main obstacle?",
            "options": ["Local Minima", "Saddle Points", "Global Maxima", "Overfitting"],
            "correct": 1,
            "explanation": "Saddle points are exponentially more common than local minima in high dimensions."
        },
        {
            "question": "What does the 'Approximation Error' in Agnostic PAC Learning refer to?",
            "options": ["The error due to finite sampling", "The error because the true concept is not in the hypothesis class", "The numerical precision error", "The labeling noise"],
            "correct": 1,
            "explanation": "It measures the minimum possible error achievable by the hypothesis class if it doesn't contain the true concept."
        },
        {
            "question": "What is the complexity of Self-Attention with respect to sequence length N?",
            "options": ["O(N)", "O(N log N)", "O(N^2)", "O(1)"],
            "correct": 2,
            "explanation": "Self-attention requires computing a dot product for every pair of tokens, leading to quadratic complexity."
        }
    ]
};
