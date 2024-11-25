"use client"

import { db } from '@/utils/db';
import { UserAnswer, InterviewData } from '@/utils/schema'; // Assuming InterviewData holds user email
import { eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

function Feedback({ params }) {
  const [feedbackList, setFeedbackList] = useState([]);
  const [userEmail, setUserEmail] = useState('');
  const router = useRouter();

  useEffect(() => {
    GetFeedback();
  }, []);

  const GetFeedback = async () => {
    const result = await db.select()
      .from(UserAnswer)
      .where(eq(UserAnswer.mockIdRef, params.interviewId))
      .orderBy(UserAnswer.id);

    console.log(result);
    setFeedbackList(result);

    // Fetch user's email from InterviewData (assuming the email is in this table)
    const interviewData = await db.select()
      .from(InterviewData)
      .where(eq(InterviewData.interviewId, params.interviewId));

    if (interviewData && interviewData.length > 0) {
      setUserEmail(interviewData[0].userEmail);
    }

    // Send email with the feedback once it's loaded
    if (userEmail) {
      sendFeedbackEmail(userEmail, result);
    }
  }

  const sendFeedbackEmail = async (email, feedback) => {
    const feedbackContent = feedback.map((item) => {
      return `
        <h3>Question: ${item.question}</h3>
        <p><strong>Rating:</strong> ${item.rating}</p>
        <p><strong>Your Answer:</strong> ${item.userAns}</p>
        <p><strong>Correct Answer:</strong> ${item.correctAns}</p>
        <p><strong>Feedback:</strong> ${item.feedback}</p>
        <hr />
      `;
    }).join('');

    const emailBody = `
      <h2>Interview Feedback</h2>
      <h3>Overall Interview Rating: 7/10</h3>
      <h3>Your Interview Feedback:</h3>
      ${feedbackContent}
    `;

    try {
      const response = await fetch('pages/api/sendEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: email,
          subject: 'Your Interview Feedback',
          html: emailBody,
        }),
      });

      if (response.ok) {
        console.log("Email sent successfully");
      } else {
        console.error("Failed to send email");
      }
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }

  return (
    <div className='p-10'>
      <h2 className='text-2xl font-bold text-green-500'>Congratulation!</h2>
      <h2 className='text-2xl font-bold'>Here is your interview feedback</h2>
      <h2 className='text-primary text-lg my-3'>Overall interview rating: <strong>7/10</strong></h2>
      <h2 className='text-sm text-gray-500'>Find Below interview question with correct answer, your answer and feedback for improvement</h2>

      {feedbackList && feedbackList.map((item, index) => (
        <Collapsible key={index}>
          <CollapsibleTrigger className='p-2 bg-secondary rounded-lg my-2 text-left flex justify-between'>
            {item.question} <ChevronsUpDown className='h-5 w-5' />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className='flex-col'>
              <h2 className='p-2 text-red-500 border rounded-lg '><strong>Rating:</strong> {item.rating}</h2>
              <h2 className='p-2 bg-red-50 border rounded-lg mt-5'><strong>Your Answer: </strong>{item.userAns}</h2>
              <h2 className='p-2 bg-green-50 border rounded-lg mt-5'><strong>Correct Answer: </strong>{item.correctAns}</h2>
              <h2 className='p-2 bg-blue-50 border rounded-lg mt-5'><strong>Feedback: </strong>{item.feedback}</h2>
            </div>
          </CollapsibleContent>
        </Collapsible>
      ))}

      <Button onClick={() => router.replace('/dashboard')}>Go Home</Button>
    </div>
  );
}

export default Feedback;
