
"use client"
import { Mic, StopCircle, Webcam } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import {Button} from '@/components/ui/button'
import useSpeechToText from 'react-hook-speech-to-text';
import { toast } from 'sonner'
import { chatSession } from 'utils/GeminiAIModal'
import { db } from '@/utils/db'
import moment from 'moment'
import { useUser } from '@clerk/nextjs'
import { UserAnswer } from '@/utils/schema'

function RecordAnswerSection({mockInterviewQuestion, activeQuestionIndex, interviewData}) {
    const [userAnswer, setUserAnswer]= useState ('');
    const {user}= useUser();
    const [loading, setLoading]=useState(false);
    const {
        error,
        interimResult,
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
        setResults
      } = useSpeechToText({
        continuous: true,
        useLegacyResults: false
      });

      useEffect (()=>{
        results.map((result)=>(
            setUserAnswer(prevAns=>prevAns+result?.transcript)
        ))

      }, [results])
      useEffect (()=> {
        if(!isRecording&&userAnswer.length>10)
        {
            UpdateUserAnswer();
        }
        // if (userAnswer?. length<10)
        //     {
        //         setLoading(false);
        //         toast('Error while saving your answer, please record again')
        //         return;
        //     }
            

      }, [userAnswer])

      const StartStopRecording = async()=>{
        if (isRecording)
        {
            
            stopSpeechToText()
        }
        else {
            startSpeechToText();
        }
      }
      const UpdateUserAnswer=async()=>{
        console.log(userAnswer)
        
        setLoading(true)
        
        const feedbackPrompt='Question:'+mockInterviewQuestion [activeQuestionIndex]?.question+
            ", User Answer:"+userAnswer+", Depends on question and user answer for the given interview question" +
            "please give us rating for answer and feedback as area of imporve if any"+
            "in just 3 to 5 lines to improve it in JSON format with rating field and feedback field";

            const result=await chatSession.sendMessage(feedbackPrompt)
            const mockJsonResp =(result.response.text()). replace ('```json', '').replace('```', '')
            console.log(mockJsonResp)
            const JsonFeedbackResp =JSON.parse(mockJsonResp);

            if (!interviewData?.mockId) {
              console.error("Error: mockId is missing");
              toast.error("Unable to save answer. Interview data is incomplete.");
              return;
          }
          

            const resp=await db.insert(UserAnswer)
            .values({
                mockIdRef:interviewData?.mockId, 
                question:mockInterviewQuestion [activeQuestionIndex]?.question, 
                correctAns: mockInterviewQuestion [activeQuestionIndex]?.answer, 
                userAns: userAnswer, 
                feedback: JsonFeedbackResp?.feedback, 
                rating: JsonFeedbackResp?.rating, 
                userEmail:user?.primaryEmailAddress?.emailAddress, 
                createdAt: moment().format('DD-MM-yyyy')  
            })
            
            if(resp)
            {
                toast('User Response recorded succesfully')
                setUserAnswer (''); 
                setResults ([]);

            }
            setResults ([]);
            setLoading(false);
            
      }
  return (
    <div> 
    <div className='flex flex-col mt-20 justify-center items-center bg-secondary rounded-lg p-5'>
        <Image src={'/webcam.png'} width={200} height={200} className='absolute'/>
        <Webcam
        mirrored={true}
        style={{
            height:300, 
            width:'100%',
            zIndex:10,
        }}
        />
    </div>
  <Button 
  disabled={loading}
  variant="outline" className="my-10 "
  onClick={StartStopRecording}
  >
    {isRecording? 
    <h2 className='text-red-600 animate-pulse flex gap-2 items-center'>
        <StopCircle/> Stop Recording
    </h2>
    :
    
    'Record Answer'} </Button>
    
   
    </div>
  )
}

export default RecordAnswerSection