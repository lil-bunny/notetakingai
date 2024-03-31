"use client";

import {
  CreateProjectKeyResponse,
  LiveClient,
  LiveTranscriptionEvents,
  createClient,
} from "speech-to-text";
import { useState, useEffect, useCallback,SetStateAction } from "react";
import { useQueue } from "@uidotdev/usehooks";


import { MicIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import store, { mulfileActions } from "./store";
import { Provider, useDispatch,useSelector } from "react-redux";

export type RootState = ReturnType<typeof store.getState>
export default function Microphone() {
  const { add, remove, first, size, queue } = useQueue<any>([]);
  const [apiKey, setApiKey] = useState<CreateProjectKeyResponse | null>();
  const [connection, setConnection] = useState<LiveClient | null>();
  const [isListening, setListening] = useState(false);
  const [isLoadingKey, setLoadingKey] = useState(true);
  const [isLoading, setLoading] = useState(true);
  const [isProcessing, setProcessing] = useState(false);
  const [micOpen, setMicOpen] = useState(false);
  const [microphone, setMicrophone] = useState<MediaRecorder | null>();
  const [userMedia, setUserMedia] = useState<MediaStream | null>();
  const [caption, setCaption] = useState<string | null>();
  const [text,setCurrentText]=useState(" ")
  const currentText=useSelector((state:RootState)=>state.mulFileOps.currentText)
  let previousCaption = '';
  var  msg: { role: string; content: any; }[]=[]


async function checkCommand(text: any){

    const url = 'http://127.0.0.1/checkCommand';
 

    
  
    const headers = {
        'Content-Type': 'application/json',
       
      };
    
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(text)
        });
    
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        const responseData = await response.json();
        
        console.log(responseData.choices[0].message.content);
        var result=responseData.choices[0].message.content;
      
        console.log("resultbia"+result)
       return result

      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }

}

  const toggleMicrophone = useCallback(async () => {

    if (microphone && userMedia) {
      setUserMedia(null);
      setMicrophone(null);

      microphone.stop();
    } else {
      const userMedia = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const microphone = new MediaRecorder(userMedia);
      microphone.start(500);

      microphone.onstart = () => {
        setMicOpen(true);
      };

      microphone.onstop = () => {
        setMicOpen(false);
      };

      microphone.ondataavailable = (e) => {
        console.log(`data=${e.data}`)

        add(e.data);
      };

      setUserMedia(userMedia);
      setMicrophone(microphone);
    }
  }, [add, microphone, userMedia]);

  useEffect(() => {
    if (!apiKey) {
      console.log("getting a new api key");
      fetch("/api", { cache: "no-store" })
        .then((res) => res.json())
        .then((object) => {
          if (!("key" in object)) throw new Error("No api key returned");

          setApiKey(object);
          setLoadingKey(false);
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }, [apiKey]);

  
  useEffect(() => {
    if (apiKey && "key" in apiKey) {

      const dataClient = createClient(apiKey?.key ?? "");
      const connection = dataClient.listen.live({
      
        language:"english",

      });

      connection.on(LiveTranscriptionEvents.Open, () => {
        console.log("socket established");
        setListening(true);
      });
      
      connection.on(LiveTranscriptionEvents.Close, () => {
        console.log("socket closed");
        setListening(false);
        setApiKey(null);
        setConnection(null);
      });
 
      connection.on(LiveTranscriptionEvents.Transcript,async (data:any) => {
        const words = data.channel.alternatives[0].words;
        console.log(data)
        const caption = 
        
        words
          .map((word: any) => word.punctuated_word ?? word.word)
          .join(" ");


        if (caption!==""  ) {
      
   
         setCurrentText(prev=>prev+caption)
         var res=await        checkCommand(caption)
          if(`${res}`.toLowerCase().length<=4) {

          }else{
            
          }
   
         

         


    
        previousCaption = caption;
        }

      });

      setConnection(connection);
      setLoading(false);
    }
  }, [apiKey]);

  useEffect(() => {
    const processQueue = async () => {
      if (size > 0 && !isProcessing) {
        setProcessing(true);

        if (isListening) {
          const blob = first;
          connection?.send(blob);
          remove();
        }

        const waiting = setTimeout(() => {
         console.log("waiting",caption)
         
          clearTimeout(waiting);
          setProcessing(false);
        }, 250);
      }
    };

    processQueue();
  }, [connection, queue, remove, first, size, isProcessing, isListening]);

  if (isLoadingKey)
    return (
      <span className="w-full text-center">Loading websocket.</span>
    );
  if (isLoading)
    return <span className="w-full text-center">Loading the app...</span>;



  return (
  
    
      <div className="w-full relative">
      <div className="mt-10 flex flex-col align-middle items-center">
       <center><h1 className=" scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-3xl">
Coolcat AI
</h1>
<p className="space-y-3">Take and edit note with your voice</p>

</center>
<div className="flex justify-center w-9/12 h-5/12 bg-white rounded-lg shadow-md p-4 ">

<Textarea id="textArea" value={text}  className=" font-black font-serif text-black disabled: h-auto " />


</div>


<Button  className={
              `cursor-pointer` + !!userMedia && !!microphone && micOpen
            ? "bg-red-400 drop-shadow-glowRed"
      : "bg-gray-600"
            }  onClick={() => toggleMicrophone()} ><MicIcon></MicIcon></Button>
            {
              microphone?<img className="h-10 w-10" src="https://media1.tenor.com/m/NjavXXAMRD8AAAAC/sound.gif" alt="Small image"></img>:''
            }

    
        <div className="mt-20 p-6 text-xl text-center">
          {text}
        </div>
       
      </div>
      <div
        className="z-20 text-white flex shrink-0 grow-0 justify-around items-center 
                  fixed bottom-0 right-5 rounded-lg mr-1 mb-5 lg:mr-5 lg:mb-5 xl:mr-10 xl:mb-10 gap-5"
      >
        <span className="text-sm text-gray-400">
          {isListening
            ? "Coolcat connection open!"
            : "Coolcat is connecting..."}
        </span>
       
        
      </div>
    </div>
    

    
  );
}
