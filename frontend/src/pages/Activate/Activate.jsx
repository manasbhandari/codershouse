import React from 'react'
import { useState } from 'react'; 
import StepName from '../Steps/StepName/StepName';
import StepAvator from '../Steps/StepAvator/StepAvator';  


const steps = {
  1: StepName ,
  2: StepAvator ,
}


const Activate = () => {
  const [step, setStep] = useState(1);
  const Step = steps[step];


  function onnext(){
    setStep(step + 1);
  }

  return (
    <div className='cardWrapper'>
      <Step onNext={onnext}>
       
       </Step>
    </div>
  )
}

export default Activate
