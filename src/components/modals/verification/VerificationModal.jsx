import React, { useState } from 'react'
import {
  Btn,
  MainContainer,
  ModalContent,
  Question
} from './VerificationModal.styles'
import LogoMotion from '../../logo-motion/LogoMotion'

const VerificationModal = ({
  verificationModal,
  setVerificationModal,
  generateURL
}) => {
  const [loading, setLoading] = useState(false)

  const handleConfirm = () => {
    setLoading(true)
    generateURL(verificationModal)
  }

  return (
    <MainContainer>
      <ModalContent>
        {loading ? (
          <LogoMotion size={'medium'} />
        ) : (
          <>
            <Question>{`Send link by ${verificationModal}?`}</Question>
            <Btn className='yes' onClick={handleConfirm}>
              YES
            </Btn>
            <Btn className='no' onClick={() => setVerificationModal('none')}>
              NO
            </Btn>
          </>
        )}
      </ModalContent>
    </MainContainer>
  )
}

export default VerificationModal
