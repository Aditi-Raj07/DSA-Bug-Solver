const API_KEY = "AQ.Ab8RN6IpdA68w44OvWQO8d7zR2H-bOfegdC1Q4nCwidwiepbtw";

let count = 0;

const SYSTEM_PROMPT = `
You are a DSA Instructor.

Rules:

1. Answer only Data Structures and Algorithms questions.
2. Explain from basics.
3. Give brute force and optimal approaches.
4. Mention time and space complexity.
5. If question is not related to DSA, politely say:
   "I am a DSA Instructor. Please ask a DSA-related question."
`;

const chatBox = document.getElementById("chatBox");
const promptInput = document.getElementById("prompt");

function addMessage(text,type){

  const div=document.createElement("div");

  div.className=`message ${type}`;

  div.textContent=text;

  chatBox.appendChild(div);

  chatBox.scrollTop=chatBox.scrollHeight;
}

async function sendMessage(){

  const prompt=promptInput.value.trim();

  if(!prompt) return;

  addMessage(prompt,"user");

  promptInput.value="";

  count++;
  document.getElementById("questionCount").textContent=count;

  addMessage("Thinking...","bot");

  try{

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
      {
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          systemInstruction:{
            parts:[
              {
                text:SYSTEM_PROMPT
              }
            ]
          },
          contents:[
            {
              parts:[
                {
                  text:prompt
                }
              ]
            }
          ]
        })
      }
    );

    const data=await response.json();

    chatBox.lastChild.remove();

    const reply=
      data.candidates?.[0]?.content?.parts?.[0]?.text
      || "No response";

    addMessage(reply,"bot");

  }
  catch(err){

    chatBox.lastChild.remove();

    addMessage(
      "Error calling Gemini API",
      "bot"
    );

    console.log(err);
  }
}

document
.getElementById("sendBtn")
.addEventListener("click",sendMessage);

promptInput.addEventListener("keydown",(e)=>{

  if(e.key==="Enter" && !e.shiftKey){

    e.preventDefault();

    sendMessage();
  }
});

document
.querySelectorAll(".topicBtn")
.forEach(btn=>{

  btn.addEventListener("click",()=>{

    promptInput.value=btn.innerText;
  });
});

document
.getElementById("themeBtn")
.addEventListener("click",()=>{

  document.body.classList.toggle("light");
});