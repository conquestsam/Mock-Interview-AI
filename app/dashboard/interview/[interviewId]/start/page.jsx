"use client"
import React, { useEffect, useState } from 'react'
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import QuestionsSection from './_components/QuestionsSection'
import RecordAnswerSection from './_components/RecordAnswerSection'
import {Button} from '@/components/ui/button'
import Link from 'next/link';



function StartInterview({ params }) {
    const [interviewData, setInterviewData] = useState(); 
    const [mockInterviewQuestion, setMockInterviewQuestion] = useState(); 
    const [activeQuestionIndex, setActiveQuestionIndex]=useState(0);
  
    useEffect(() => {
      GetInterviewDetails();
    }, [params]); // Add params as a dependency
  
    const GetInterviewDetails = async () => {
      try {
        const interviewId = params?.interviewId; // Extract interviewId
        if (!interviewId) {
          console.error("interviewId is not defined.");
          return;
        }
  
        const result = await db
          .select()
          .from(MockInterview)
          .where(eq(MockInterview.mockId, interviewId));
  
        if (!result || result.length === 0) {
          console.error("No interview found for the given interviewId");
          return;
        }
  
        const jsonMockResp = result[0]?.jsonMockResp 
          ? JSON.parse(result[0].jsonMockResp) 
          : null;
  
        if (jsonMockResp) {
          console.log(jsonMockResp);
          setMockInterviewQuestion(jsonMockResp);
        } else {
          console.error("Invalid or missing jsonMockResp");
        }
  
        setInterviewData(result[0]);
      } catch (error) {
        console.error("Error fetching interview details:", error);
      }
    };
  
    return <div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
            {/**Questions */}
            <QuestionsSection 
            mockInterviewQuestion={mockInterviewQuestion} 
            activeQuestionIndex={activeQuestionIndex}
            />

            {/**Video/Audio Recording */}
            <RecordAnswerSection 
             mockInterviewQuestion={mockInterviewQuestion} 
             activeQuestionIndex={activeQuestionIndex}
             interviewData={interviewData}
            />
        </div>
        <div className='flex justify-end gap-6'>
          {activeQuestionIndex>0 && 
          <Button onClick={()=>setActiveQuestionIndex(activeQuestionIndex-1)} >Previous Question </Button>}
          {activeQuestionIndex!=mockInterviewQuestion?.length-1&& 
          <Button onClick={()=>setActiveQuestionIndex(activeQuestionIndex+1)}>Next Question </Button>}
           {activeQuestionIndex==mockInterviewQuestion?.length-1&& 
           <Link 
           href={`/dashboard/interview/${interviewData?.mockId}/feedback`}
           > 
           <Button>End Interview </Button>
           </Link>}
           
        </div>
    </div>;
  }
  
  export default StartInterview;
  