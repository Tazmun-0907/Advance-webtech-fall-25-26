
const studentName = "Akhi";

let marks = [85, 72, 90, 65, 80];


marks.push(88);



function calculateTotal(marks) {
   let total = 0;

   for (let i = 0; i < marks.length; i++) {
       total = total + marks[i];
   }

   return total;
}



function calculateAverage(total, marks) {
   return total / marks.length;
}



function findHighestMark(marks) {
   let highest = marks[0];

   for (let i = 1; i < marks.length; i++) {
       if (marks[i] > highest) {
           highest = marks[i];
       }
   }

   return highest;
}



function countPassedSubjects(marks) {
   let count = 0;

   for (let i = 0; i < marks.length; i++) {
       if (marks[i] >= 40) {
           count++;
       }
   }

   return count;
}



function findGrade(average) {
   if (average >= 80) {
       return "A+";
   } else if (average >= 70) {
       return "A";
   } else if (average >= 60) {
       return "B";
   } else if (average >= 50) {
       return "C";
   } else if (average >= 40) {
       return "D";
   } else {
       return "F";
   }
}



const total = calculateTotal(marks);
const average = calculateAverage(total, marks);
const highest = findHighestMark(marks);
const passedSubjects = countPassedSubjects(marks);
const grade = findGrade(average);


let result;

if (average >= 40) {
   result = "PASS";
} else {
   result = "FAIL";
}



console.log("Student Name:", studentName);
console.log("Marks:", marks);
console.log("Total Marks:", total);
console.log("Average:", average);
console.log("Highest Mark:", highest);
console.log("Grade:", grade);
console.log("Passed Subjects:", passedSubjects);
console.log("Result:", result);