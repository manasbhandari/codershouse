import React , {useState} from 'react'
import Card from '../../../components/shared/Card/Card'
import TextInput from '../../../components/shared/TextInput/TextInput'
import Button from '../../../components/shared/Button/Button'
import styles from './StepOtp.module.css'
import { verifyOtp } from '../../../http/index'
import { useSelector } from 'react-redux'
import {setAuth} from '../../../store/authSlice'
import {useDispatch} from 'react-redux'


const StepOtp = () => {
  const [otp, setOtp] = useState('');
  const {phone , hash } = useSelector((state) => state.auth.otp);
    const dispatch = useDispatch();



  async function submit(){
    // console.log(otp);
    if (!otp || !phone || !hash) return alert('Please enter the OTP');

    try {
        const {data} = await verifyOtp({otp , phone , hash });
        console.log(data);
        dispatch(setAuth(data));
         
    }
    catch (error) {
      console.log(error);
    }
  

}
  
return (
    <>
            <div className={styles.cardWrapper}>
                <Card
                    title="Enter the code we just texted you"
                    icon="lock-emoji"
                >
                    <TextInput
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />
                    <div className={styles.actionButtonWrap}>
                        <Button onClick={submit} text="Next" />
                    </div>
                    <p className={styles.bottomParagraph}>
                        By entering your number, you are agreeing to our Terms of
                        Service and Privacy Policy. Thanks!
                    </p>
                </Card>
            </div>
        </>
  )
}

export default StepOtp
