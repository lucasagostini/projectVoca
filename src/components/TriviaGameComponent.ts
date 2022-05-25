import { Component, BaseComponent, Intents, Message } from '@jovotech/framework';

import { ABCDOutput } from '../output/ABCDOutput';
import { NameOutput } from '../output/NameOutput';

import csv from 'csv-parser';
import fs from 'fs';
import { YesNoOutput } from '../output/YesNoOutput';

let language: string[][] = []
let name: string;

@Component()
export class TriviaGameComponent extends BaseComponent {
  START() {
    readFiles(this.$request.getLocale()!)
    if(this.$user.isNew){
      return this.$send(NameOutput, { message: 'Hi there, welcome to Sporty Trivia, the ultimate quiz for football fans. What is your first name?',  listen: true });
    }
    else{
      return this.$send({ message: 'Hi {firstName}, welcome back to Sporty Trivia, the ultimate quiz for football fans.', listen: false });
    }
    
  }
  @Intents(['NameIntent'])
  name() {

    name = this.$input.text!;
    name = name.split(" ").pop()!;
    name = name.charAt(0).toUpperCase() + name.slice(1);
    return this.$send(YesNoOutput, { message: name+', is that correct?', listen: true });
  }


  @Intents(['NewGameIntent'])
  newGame() {
    this.$send({ message: `Let\'s get started with a new game.`, listen: false });

    let errors = 0;
    let questions: number[] = [];
    let points = 0;
    let questionsAsked = 0;
    console.log("teste")

    while(errors < 3 || questionsAsked == 5){
      let rand = Math.floor(Math.random() * language.length)
      while(questions.includes(rand)){
        rand = Math.floor(Math.random() * language.length)
      }
      questions.push(rand);
      
      let selectedQuestion: string[] = language[rand];
      let correct = selectedQuestion[1];
      let question = selectedQuestion.shift();
      
      selectedQuestion = selectedQuestion.sort(() => Math.random() - 0.5)
      questionsAsked+=1;

      // check which randomized alternative was the correct one
      let alternative = findCorrect(selectedQuestion, correct);
      let questionNumber = "Question number "+ questionsAsked + " .";
      this.$send(ABCDOutput, { message: questionNumber+question, listen: true})
      let response = this.$input
      
      

      if(response.text == alternative){
        points+=1;
        this.$send({ message: "Correct answer.",  listen: false })
      }
      else{
        errors+=1;
        this.$send({ message: "Wrong answer. The correct answer was: " + alternative + ".",  listen: false })
      }
    }

    let output: string = '';
    if(errors == 3){
      output+="You made three mistakes."
    }
    output+="The game has ended, "+ name + " . You scored "+ points +" points. Would you like to play another game?"

    return this.$send(YesNoOutput, {message:output,  listen: true})


  }
  UNHANDLED() {
    return this.START();
  }
  
}

function readFiles(locale:string){
  // read english file and save it in an array of arrays
  if(locale == "en"){
    fs.createReadStream('./src/sporty-trivia-en-games.csv')
    .pipe(csv())
    .on('data', (r) => {
      language.push(r);        
    })
  }
  if(locale == "it"){
    fs.createReadStream('./src/sporty-trivia-it-games.csv')
    .pipe(csv())
    .on('data', (r) => {
      language.push(r);        
    })
  }
}

function findCorrect(alternatives:string[], correct:string){
  if (alternatives[0] == correct){
    return "A";
  }
  else if (alternatives[1] == correct){
    return "B";
  }
  else if (alternatives[2] == correct){
    return "C";
  }
  else{
    return "D";
  }

}