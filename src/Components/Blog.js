import { type } from "@testing-library/user-event/dist/type";
import { useEffect, useRef ,useReducer,useState} from "react";
import { db } from "../firebaseInit";
import { collection, addDoc,getDocs,onSnapshot,doc, deleteDoc } from "firebase/firestore"; 




//Blogging App using Hooks
function blogReducer(state,action){
  switch(action.type){ 
    // case "ADD":     //only for set data manually i.e using get data (not get real-tim data)
    //         return [action.blog, ...state];
        
    case "SET-BLOGS":       //for  get real-time data onSnapShot listner----
        return action.blogs;
    
    case"REMOVE":                           //        dispatch({type:"REMOVE",index:i});
     return state.filter((blog,i)=>i !== action.index);
    default:
        return state;

  }
}
export default function Blog(){
    let [formData,setFormData]=useState({title:"",content:""});
    // let [blogs,setBlogs]=useState([]);
    let [blogs,dispatch]=useReducer(blogReducer, []);

    let titleRef = useRef(null);
    //Passing the synthetic event as argument to stop refreshing the page on submit
    async function handleSubmit(e){
        e.preventDefault();
          // manually setting blogs for get data ----------
        // setBlogs([{title:formData.title,content:formData.content},...blogs]);
        // or using reducer---------manually setting blogs for get data-------
       // dispatch({type:"ADD",blog:{title:formData.title,content:formData.content}});
        
        // Add a new document with a generated id.
     const docRef = await addDoc(collection(db, "blogs"), {
        title: formData.title,
        content: formData.content,
        createdOn: new Date()
     });
    //    console.log("Document written with ID: ", docRef.id);
        setFormData({title:"",content:""});
        titleRef.current.focus();
        
    }

     async function removeBlog(id){
        // locally setting state---
        // setBlogs(blogs.filter((item,index) => index !== i));
        //or  --locally setting state------
        //dispatch({type:"REMOVE",index:i});
        // using real-time updation
        const docRef=doc(db,"blogs",id);
        await deleteDoc(docRef);
       
    }
    useEffect(()=>{
        // get all the document from the collection firebase db using----GET DATA
    //     async function fetchData() {
    //         try {
    //             const querySnapshot = await getDocs(collection(db, "blogs"));
    //             console.log("querySnapshot",querySnapshot);
    //            const blogs  =querySnapshot.docs.map((doc)=>{
    //             return{
    //                 id:doc.id,
    //                 // title:doc.data().title,
    //                 // content:doc.data().content
    //                 ...doc.data()
    //             }
    //            })
    //            console.log("blogs",blogs);
    //            dispatch({ type: "SET-BLOGS", blog: blogs });
    //         } catch (error) {
    //             console.error("Error fetching data:", error);
    //         }
    //     }
    //   fetchData();

        const unsub = onSnapshot(collection(db,"blogs"),(snapShot)=>{
            const blogs  =snapShot.docs.map((doc)=>{
                            return{
                                id:doc.id,
                                ...doc.data()
                            }
                           })
            dispatch({type:"SET-BLOGS",blogs:blogs});

        });
      
    }, []);
    
    useEffect(()=>{
        titleRef.current.focus();
    }, []);
    useEffect(()=>{
        if(blogs.length && blogs[0].title){
            document.title=blogs[0].title;
        }else{
            document.title="No blogs !";
        }
        
    },[blogs]);

   

    return(
        <>
        {/* Heading of the page */}
        <h1>Write a Blog!</h1>

        {/* Division created to provide styling of section to the form */}
        <div className="section">

        {/* Form for to write the blog */}
            <form onSubmit={handleSubmit}>

                {/* Row component to create a row for first input field */}
                <Row label="Title">
                        <input className="input" value={formData.title} onChange={(e)=>setFormData({title:e.target.value,content:formData.content})}
                            ref={titleRef}    placeholder="Enter the Title of the Blog here.."/>
                </Row >

                {/* Row component to create a row for Text area field */}
                <Row label="Content">
                        <textarea className="input content" value={formData.content} onChange={(e)=>setFormData({title:formData.title,content:e.target.value})}
                                placeholder="Content of the Blog goes here.."/>
                </Row >

                {/* Button to submit the blog */}            
                <button className = "btn add-btn">ADD</button>
            </form>
                     
        </div>

        <hr/>

        {/* Section where submitted blogs will be displayed */}
        <h2> Blogs </h2>
        {blogs.map((b,i)=>(
            <div className="blog" key={i}>
              <h3>{b.title}</h3>
              <p>{b.content}</p>
              <div className="blog-btn">
                              <button onClick={()=>removeBlog(b.id)} className="btn remove">Delete</button>

            </div>
            </div>
           
           
        ))}
       
        </>
        )
    }

    //Row component to introduce a new row section in the form
    function Row(props){
        const{label} = props;
        return(
            <>
            <label>{label}<br/></label>
            {props.children}
            <hr />
            </>
        )
    }
