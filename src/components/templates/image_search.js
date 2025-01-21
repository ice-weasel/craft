import { Target } from 'lucide-react';
import 'reactflow/dist/style.css';


const initialNodes = [
      {
        id: "1",
        type: "input",
        data: { label: "Start" },
        position: { x: 250, y: 25 },
      },
      {
        id: "2",
        type:"conditional",
        data: { label: "process-images" },
        position: { x: 250, y: 100 },
      },
      {
        id:"3",
        type:"default",
        data: { label: "search-images" },
        position: { x: 50, y: 175 }
      },
      {
        id:"4",
        type:"default",
        data: { label: "describe-images" },
        position: {x: 450, y: 175}
      },
      {
        id:"5",
        type:"output",
        data: { label: "Stop" },
        position: {x: 250,y: 250 }
      }

      
]

const initialEdges = [
    {
        id:'1-2',
        source:'1',
        target:'2'
    },
    {
        id:'2-3',
        source:'2',
        target:'3'
    },
    {
        id:'2-4',
        source:'2',
        target:'4'
    },
    {
        id:'3-5',
        source:'3',
        target:'5'
    },
    {
        id:'4-5',
        source:'4',
        target:'5'
    }
]

const nonDeletableNodes = ['1','3','4','5'];
const nonDeletableEdges = [ ];

const group1 = [];
const group2 = [];

const basic = ["img-tools"]
const advanced = ["asdasd"]



export  {initialNodes,initialEdges,nonDeletableNodes,nonDeletableEdges,group1,group2,basic}
