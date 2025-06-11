const { openai } = require('../config/openAi');
const Interview = require('../models/interview');
const Feedback = require('../models/feedback');

exports.getQuestion = async (req, res) => {
    try {
        // Destructure jobRole, jobDescription, and yearsOfExperience from the request body
        const { role, description, years } = req.body;



        const genAI = openai();
        // const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL });
        // Check if required fields are provided
        if (!role || !description || !years) {
            return res.status(400).json({ error: 'Missing required fields.' });
        }

        // Construct the prompt dynamically based on input
        const prompt = `
      You are an AI interviewer. Generate 5 interview questions based on the following details:
      Job Role: ${role}
      Job Description: ${description}
      Years of Experience: ${years}
      Please provide the output in JSON format as follows:
      {
        "questions": [
          {"question": "stringformat"},
          {"question": "stringformat"},
          {"question": "stringformat"},
          {"question": "stringformat"},
          {"question": "stringformat"}
        ]
      }
    `;

        // Fetch the response from the Gemini API
        const result = await model.generateContent(prompt);
        // console.log(result.response.text())
        // Parse the response and return it
        let responseText = result.response.text();
        responseText = responseText.replace(/```json/g, '').replace(/```/g, '');
        const jsonResponse = JSON.parse(responseText);
        // Send the result back to the client
        return res.status(200).json(
            {
                success: true,
                message:"Questions fetched successfully",
                question:jsonResponse
            }
        );

    } catch (error) {
        console.error('Error fetching interview questions:', error.message);
        return res.status(500).json({ error: 'An error occurred while generating questions.' });
    }
}

// exports.interviewSubmission = async (req, res) => {

//     try {
//         // Destructure the request body
//         const { role, description, years, Question, Answer } = req.body;
       
//         console.log(Question, Answer);
//         // Check if required fields are provided
//         if (!role || !description || !years || !Question || !Answer) {
//             return res.status(400).json({ error: 'Missing required fields.' });
//         }

//         // Prepare feedback array
//         const feedbackArray = [];

//         let score = 0;

//         // Iterate over the questions and answers to generate feedback
//         for (let i = 0; i < Question.length; i++) {
//             const questionText = Question[i].question;
//             const answerText = Answer[i]?.answer||"Not Answered";

//             // Construct the prompt dynamically based on question and answer
//             const prompt = `
//         You are an AI interviewer. Evaluate the following answer based on the question:
//         Question: ${questionText}
//         Answer: ${answerText}
//         Based on the job role (${role}), job description (${description}), and years of experience (${years}), is the answer correct? Provide feedback on the answer.
//         Respond with a JSON format:
//         {
//           "isCorrect": boolean,
//           "feedback": "string"
//         }
//       `;

//             // Fetch the response from the Gemini API
//             const result = await model.generateContent(prompt);
//             let responseText = result.response.text();
//             console.log(responseText);
//             // Parse the response from the Gemini API
//             const evaluation = JSON.parse(responseText);

//             // Create the feedback object
//             const feedbackObject = {
//                 question: questionText,
//                 answer: answerText,
//                 isCorrect: evaluation.isCorrect,
//                 feedback: evaluation.feedback
//             };

//             // Add feedback object to feedback array
//             feedbackArray.push(feedbackObject);

//             // If the answer is correct, increment the score
//             if (evaluation.isCorrect) {
//                 score++;
//             }
//         }

//         // Return the final JSON response with feedback and score
//         return res.status(200).json({
//             success: true,
//             message:'interview result is fetched',
//             Feedback: {
//                 feedback: feedbackArray,
//                 score: score
//             }

//         }
//        );

//     } catch (error) {
//         console.error('Error generating feedback:', error.message);
//         return res.status(500).json({ error: 'An error occurred while generating feedback.' });
//     }
// }








exports.interviewSubmission = async (req, res) => {
    try {
        // Destructure jobRole, jobDescription, and yearsOfExperience from the request body
        const { role, description, years,Question,Answer} = req.body;

        

        const genAI = openai();
        // const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL });
        // Check if required fields are provided
        if (!role || !description || !years || !Question || !Answer) {
            return res.status(400).json({ error: 'Missing required fields.' });
        }
        console.log('hello');
        console.log(Question, Answer);
        // Construct the prompt dynamically based on input
        const prompt = `
        You are an AI interviewer. Evaluate the following answer based on the question:
        Question: ${Question}
        Answer: ${Answer}
        Based on the job role (${role}), job description (${description}), and years of experience (${years}), is the answer correct? Provide feedback on the answer.
        Respond with a JSON format:
        {

         score:Number,
         feedback:[{
            "question":${Question[0].question},
            "answer": ${Answer[0].answer},
            "isCorrect": boolean,
            "feedback": "string"
    },{
             "question":${Question[1].question},
            "answer": ${Answer[1].answer},
            "isCorrect": boolean,
            "feedback": "string"
    },{
            "question":${Question[2].question},
            "answer": ${Answer[2].answer},
            "isCorrect": boolean,
            "feedback": "string"
    },
    },{
            "question":${Question[3].question},
            "answer": ${Answer[3].answer},
            "isCorrect": boolean,
            "feedback": "string"
    },
    },{
            "question":${Question[4].question},
            "answer": ${Answer[4].answer},
            "isCorrect": boolean,
            "feedback": "string"
    }
            
    ]
         
    // feedback array has objects and each objects consists unique keys: question,answer,iscorrect,feedback. And score should be equal to number of true iscorrect key.Give 
    //      positive feedback in case isCorrect is true  
        } 
        `;

        // Fetch the response from the Gemini API
        const result = await model.generateContent(prompt);
        // console.log(result.response.text())
        // Parse the response and return it
        let responseText = result.response.text();
        responseText = responseText.replace(/```json/g, '').replace(/```/g, '');
        const jsonResponse = JSON.parse(responseText);
        // Send the result back to the client
        jsonResponse.role = role;
        jsonResponse.description = description;
        jsonResponse.years = years;
        console.log(jsonResponse);

        //Its Time to handle connection with database
        //And we will meet after mid sem examination
        let Id = new Array();

        for (const element of jsonResponse.feedback)
        {
            let feedres=await Feedback.create({
                question: element.question,
                answer: element.answer,
                isCorrect: element.isCorrect,
                feedback:element.feedback
            })
            Id.push(feedres._id);
        }
        
        await Interview.create(
            {
                email: req.user.email,
                jobdescription: description,
                jobrole: role,
                experience: years,
                feedback: Id
            }
        )

        return res.status(200).json(
            {
                success: true,
                message:"Feedback fetched successfully",
                question:jsonResponse
            }
        );

    } catch (error) {
        console.error('Interview Submission Error:', error.message);
        return res.status(500).json({ error: 'An error occurred while generating questions.' });
    }
}


exports.getInterview = async (req, res) => {
    try {
        
        let email = req.user.email;
        let interviewsdata = await Interview.find({ email }).populate('feedback');
        
        if (!interviewsdata)
        {
            return res.status(404).json(
                {
                    success: false,
                    message:"Data corresponding to email is not found"
                }
            )
        }

        return res.status(200).json({
            success: true,
            message: "Interviews data fetched",
            data:interviewsdata
        })
    }
    catch (error)
    {
        console.log("Error Occured: ",error.message);
        return res.status(500).json({ error: 'An error occurred while generating questions.' })
    }
}


exports.deleteInterview = async (req, res) => {
    
    try {
        const {id} = req.body;
        const interviewdata = await Interview.findById(id);

        if (!interviewdata) {
            return res.status(404).json(
                {
                    success: false,
                    message: "Data corresponding to email is not found, and hence cannot be deleted"
                }
            )   
        }

        for (const id of interviewdata.feedback) {
            
            await Feedback.findByIdAndDelete(id);
        
        }
       
        await Interview.findByIdAndDelete(id);
        
        let email = req.user.email;
        let interviewsdata = await Interview.find({ email }).populate('feedback');
        
        return res.status(200).json({
            success: true,
            message: "Requested Interview data deleted and updated interviews fetched",
            data: interviewsdata
        })


    }
    catch (error) {
        console.log("Error Occured: ", error.message);
        return res.status(500).json({ error: 'An error occurred while generating questions.' })
    }
}