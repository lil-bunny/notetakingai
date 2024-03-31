import {PayloadAction, configureStore, createReducer, createSlice} from '@reduxjs/toolkit'

interface MulFileSlice {
    hasFile: boolean;
    loadFile:boolean
    file: File[] | undefined;
    fileUrl:string[],
    isProcessing:boolean
    resumeTextList:[],
    jobDescription:"",
    finalResumeList:[],
  
    currentText:''

  }
  const initialMulFileSlice:MulFileSlice={hasFile:false,file:[],fileUrl:[],loadFile:false,isProcessing:false,
   finalResumeList:[],jobDescription:"",resumeTextList:[],currentText:''}
const mulfileSlice=createSlice({
    name:'filecrud',
    initialState:initialMulFileSlice,
    reducers:{
        addText(state,action){
            state.currentText+=`${action.payload}`
        },
    
        setFinalResume(state,action){
            state.finalResumeList=action.payload
        },
        setJobDescription(state,action){
            state.jobDescription=action.payload
                    },
        setResumeTexts(state,action){
            state.resumeTextList=action.payload
        }
        ,
        startProcess(state,){
            state.isProcessing=true
        },
        finishProcess(state){
            state.isProcessing=false
        },
        load(state){
            state.loadFile=true
        },
        unload(state){
            state.loadFile=false
        },

        setFileUrl(state,action){
            state.fileUrl=action.payload
            console.log('ball=',state.fileUrl)

        },
        loadFile(state,action){
            state.hasFile=true;
            state.file?.push(action.payload);
            console.log('hey file ');
        },
        removeFile(state){
            state.hasFile=false
           
            state.fileUrl=[]
            state.loadFile=false
            state.file=[]
            console.log('length now=',state.fileUrl)
        },

    }
})
const store=configureStore({
    reducer:{mulFileOps:mulfileSlice.reducer,
 
}});

export const mulfileActions=mulfileSlice.actions;

export default store


