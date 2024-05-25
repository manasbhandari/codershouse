import React from 'react'
import styles from "./StepAvator.module.css";

const StepAvator = ({onNext}) => {
  return (
    <>
      <div>Avator hu me bsdk</div>
      <button onClick={onNext}>Next </button>
    </>
  )
}

export default StepAvator
