import React from 'react'
import NavBar from "./NavBar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {Link} from "react-router-dom"
import { ref, child, remove, get } from "firebase/database";
import db from "./FbConfig";

export default function Home() {
    
    const nav = useNavigate();
    const [user,setUser]=useState("");
    const admin = localStorage.getItem("admin");
	console.log(admin);
	const [info, setInfo] = useState([]);

	useEffect(() => {

		const dbref = ref(db);

		get(child(dbref, "student/"))
			.then((snapshot) => {
				if (snapshot.exists()) {
					setInfo([]);
					console.log(snapshot.val());
					const data = snapshot.val()
					if (data !== null) {
						Object.values(data).map((da) => {
							setInfo((oldArray) => [...oldArray, da]);
						});
					}
				}
				else {
					console.log("no data");
				}
			})
			.catch(error => console.log(error));

		let un = localStorage.getItem("un");
		if (un != null) {
			setUser("Welcome " + un);
		}
		else {
			nav("/login");
		}
	}, [nav]);

	const lo = (event) => {
		event.preventDefault();
		localStorage.clear();
		nav("/login");
	}
	const delStu = (rno) => {
		const r3 = ref(db, "student/" + rno);
		remove(r3)
			.then(() => {
				alert("Record Deleted");
				window.location.reload();
			})
			.catch(err => console.log(err));
	}

    useEffect(()=>{
        let un=localStorage.getItem("un");
        if(un!=null){
            setUser( un );
        }
        else{
            nav("/login");
        }
    },[]);

    

       
  return (
    <div>
        <center>
        <NavBar/>
        <h1>HOME PAGE </h1>
        <h2> <marquee behavior="alternate" direction="left" scrollamount="11">
    Welcome to our website!
</marquee> {user} </h2>
        {(admin != "yes") &&
					<div>
						<h4>
							To give a <b><i>Feedback</i></b><br />
							Go to <b><i>Feedback</i></b> from Navbar or Click
						</h4>
						<button class="go-home">
							<Link to="/feedback" style={{ textDecoration: "none" }}>Give Feedback</Link>
						</button>
					</div>
				}

				{(admin === "yes") && <table border="5" style={{ width: "auto" }}>
					<div style={{ fontSize: "62%" }}>
						<tr>
							
							<th>E-Mail</th>
							<th>Name</th>
							<th>Feedback</th>
							<th>Rating</th>
							<th>Delete</th>
						</tr>
						{
							info.map(e => {
								console.log(e);
								return (
									<tr style={{ "textAlign": "center" }}>
										
										<td>{e.email}</td>
										<td>{e.name}</td>
										<td>{e.marks}</td>
										<td>{<div className="star-rating">
											{[...Array(5)].map((star, index) => {
												index += 1;
												return (
													<button
														id="star"
														type="button"
														key={index}
														className={index <= e.rating ? "on" : "off"}
													>
														<span className="star">&#9733;</span>
													</button>
												);
											})}
										</div>}</td>
										<td><button onClick={() => {
											if (window.confirm("Are You Sure???")) delStu(e.name)
										}}>Delete</button></td>
									</tr>
								)
							})
						}
					</div>
				</table>}
        
        
        </center>
      
    </div>
  )
}
