import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';
import './App.css';

const API = '';

class App extends Component {
   constructor() {
      super();

      this.state = {
         students: [],
         searchValue: "",
         tagValue: "",
         expandedStudents: []
      }
   }

   componentDidMount = () => {
      fetch(API)
      .then(response => response.json())
      .then(data => {
         let students = data.students;
         students = students.map(s => {
            s.tags = [];
            return s;
         });
         this.setState({ students: students })
      });
   }

   expandStudent = student => {
      let expandedStudents = this.state.expandedStudents;
      if (expandedStudents.indexOf(student) < 0) {
         expandedStudents.push(student);
         this.setState({expandedStudents: expandedStudents});
      }
      else {
         expandedStudents = expandedStudents.filter(s => s !== student);
         this.setState({expandedStudents: expandedStudents});
      }
   }

   handleTagEditor = (event, student) => {
      if (event.key === 'Enter') {
         let tagName = event.target.value;
         student.tags.push(tagName);
         let students = this.state.students;
         let index = students.map(function(s) { return s.email; }).indexOf(student.email);
         if (index >= 0) {
            console.log(index);
            students.splice(index, 1, student);
            this.setState({students: students});

            event.target.value = "";
         }
      }
   }

   renderStudents = () => {
      let students = [];
      let student_state = this.state.students;
      let num_students = student_state.length;

      for (let i = 0; i < num_students; i++) {
         let student = student_state[i];

         if (this.state.searchValue
            && !student.firstName.toLowerCase().includes(this.state.searchValue.toLowerCase())
            && !student.lastName.toLowerCase().includes(this.state.searchValue.toLowerCase())) {
            continue;
         }

         if (this.state.tagValue && !student.tags.some(t => t.toLowerCase().includes(this.state.tagValue))) {
            continue;
         }

         let name = student.firstName + " " + student.lastName;
         let grades = student.grades;
         let avg = 0;
         if (grades.length) {
            let sum = grades.reduce((x, y) => parseInt(x) + parseInt(y));
            avg = sum / grades.length;
         }

         let expandedInfo = [];
         let tags = [];
         if (this.state.expandedStudents.indexOf(student) >= 0) {
            expandedInfo.push(<br key='break1'></br>);

            for (let j = 0; j < grades.length; j++) {
               expandedInfo.push(
                  <span className='grades' key={j}>
                     Test{j + 1}: {grades[j]}%
                  </span>
               );
            }

            for (let j = 0; j < student.tags.length; j++) {
               tags.push(
                  <div key={'Tag' + j} className='tag'>{student.tags[j]}</div>
               );
            }

            expandedInfo.push(<div key='tags' className='tags'>{tags}</div>)

            expandedInfo.push(
            <TextField
               className="addTagBox"
               placeholder="Add a tag"
               onKeyPress={e => this.handleTagEditor(e, student)}
               key="addTagField"
               type="text"
               name="tag"
            />
            );
         }

         students.push(
            <Grid container spacing={24} className='student' key={student.id}>
               <Grid item sm={2}>
                  <div className='profile_picture'>
                     <Avatar src={student.pic} alt="profile pic"/>
                  </div>
               </Grid>
               <Grid item sm={10}>
                  <div className='info'>
                     <div>
                        <span className='name'>{name}</span>
                        {this.state.expandedStudents.indexOf(student) < 0 ? 
                        <span className='expand' onClick={() => this.expandStudent(student)}>+</span> :
                        <span className='expand' onClick={() => this.expandStudent(student)}>-</span>}
                     </div>

                     <span className='details'>Email: {student.email}</span>
                     <span className='details'>Company: {student.company}</span>
                     <span className='details'>Skill: {student.skill}</span>
                     <span className='details'>Average: {(avg).toFixed(2)}%</span>
                        
                     <div className="expandedSection">{expandedInfo}</div>
                  </div>
               </Grid>
            </Grid>
         );
      }

      return (
      <div className='studentList'>
         <div className='searchBox'>
            <TextField
               className="search"
               placeholder="Search by Name"
               onChange={(text) => this.setState({searchValue: text.target.value, expandedStudents: []})}
               type="text"
               name="searchName"
            />
            <TextField
               className="search"
               placeholder="Search by Tag"
               onChange={(text) => this.setState({tagValue: text.target.value, expandedStudents: []})}
               type="text"
               name="searchTag"
            />
         </div>
         <div className='students'>{students}</div>
      </div>
      );
   }

   render() {
      return (
         <div className='studentApp'>
            {this.renderStudents()}
         </div>
      );
   }
}

export default App;
