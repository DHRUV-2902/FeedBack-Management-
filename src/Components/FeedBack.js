import NavBar from "./NavBar";
import { useState, useEffect } from "react";
import { ref, set, get, child, query, orderByChild, equalTo } from "firebase/database";
import { useNavigate } from "react-router-dom";
import db from "./FbConfig";

export default function Feedback() {
  const nav = useNavigate();
 
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [marks, setMarks] = useState("");
  const [rating, setRating] = useState(0);

  
  const hName = (event) => {
    setName(event.target.value);
  };
  const hEmail = (event) => {
    setEmail(event.target.value);
  };
  const hMarks = (event) => {
    setMarks(event.target.value);
  };

  useEffect(() => {
    let un = localStorage.getItem("un");
    let admin = localStorage.getItem("admin");
    if (un != null) {
      setEmail(un);
      if (admin === "yes") {
        nav('/home');
      }
    } else {
      nav("/login");
    }
  }, [nav]);

  const save = (event) => {
    event.preventDefault();
    if (name.trim() === "") {
      alert("NAME cannot be empty");
      return;
    }
    if (marks.trim() === "") {
      alert("FEEDBACK cannot be empty");
      return;
    }
   
  
    // Error handling for name length
    if (name.trim().length < 2) {
      alert("Name should be greater than 2 characters.");
      return;
    }

    // Error handling for name containing a number
    if (!/^[A-Za-z ]+$/.test(name)) {
      alert("Name should not contain numbers.");
      return;
    }
  
    
    const r1 = ref(db);
    const emailQuery = query(
      child(r1, "student"),
      orderByChild("email"),
      equalTo(email)

    );
    get(emailQuery)
      .then((snapshot) => {
        if (snapshot.exists()) {
          alert(email + " already exists");
          setName("");
          setEmail("");
          setMarks("");
          setRating(0);
        } else {
          let data = { name, email, marks, rating };
          const r2 = ref(db, "student/" + name); 
          set(r2, data);
          alert("Record created");
        
          setName("");
          setEmail("");
          setMarks("");
          setRating(0);
          
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <center>
        <NavBar />
       
        <div class="form-container">
          <div class="form">
            <form onSubmit={save}>
            <span class="heading">Get in touch</span>
                <input className="input" id="mail" class="input" type="email" placeholder="Enter Email"   onChange={hEmail}  value={email}   disabled  />
                <br />
                <input className="input"  class="input"  type="text"  placeholder="Enter Name"  onChange={hName}   value={name}  />
                <br/>
                <textarea className="input"  id="message" name="message" class="textarea" type="text"  placeholder="Enter Review" onChange={hMarks}    value={marks}  cols={30} rows={5}   >  </textarea>
              
              <div >
                {[...Array(5)].map((star, index) => {
                  index += 1;
                  return (
                    <button id="star"   type="button"  key={index}
                      className={index <= rating ? "on" : "off"}
                      onClick={() => setRating(index)}
                      onDoubleClick={() => {
                        if(rating>0){
                          setRating(rating-1);
                        }
                        }}>
                      <span className="star">&#9733;</span>
                    </button>
                  );
                })}
              </div>
              <br />
              <div class="button-container">
              <button class="send-button"  >Save</button>
              <div class="reset-button-container">
            <button id="reset-btn" class="reset-button" style={{width:"100%"}}>Reset</button>
        </div>
              </div>
              
            </form><br />
          </div>
        </div>
      </center>
    </>
  );
}