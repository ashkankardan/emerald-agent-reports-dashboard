import React, { useRef, useEffect, useState } from "react";
import { doc, updateDoc, db } from "../../../config";
import {
  BottomRow,
  Btn,
  BtnContainer,
  CloseIcon,
  Input,
  InputRow,
  Label,
  MainContainer,
  ModalContent,
  BottomLeftCol,
  BottomRightCol,
  TopRow,
  AgentName,
} from "./EnrollmentsUpdateModal.styles";

const EnrollmentsUpdateModal = ({ setDisplayUpdate, agentEnrollments }) => {
  const [updatingEnrollments, setUpdatingEnrollments] = useState(false);

  const formRef = useRef(null);

  // Setting default values when the component mounts
  useEffect(() => {
    if (agentEnrollments && formRef.current) {
      formRef.current.elements["cancellationAmount"].value =
        agentEnrollments.cancellationAmount;
      formRef.current.elements["cancellationCount"].value =
        agentEnrollments.cancellationCount;
      formRef.current.elements["dayCount"].value = agentEnrollments.dayCount;
      formRef.current.elements["dayAmount"].value = agentEnrollments.dayAmount;
      formRef.current.elements["pendingCount"].value =
        agentEnrollments.pendingCount;
      formRef.current.elements["pendingAmount"].value =
        agentEnrollments.pendingAmount;
      formRef.current.elements["weekCount"].value = agentEnrollments.weekCount;
      formRef.current.elements["weekAmount"].value =
        agentEnrollments.weekAmount;
      formRef.current.elements["monthAmount"].value =
        agentEnrollments.monthAmount;
      formRef.current.elements["quarterAmount"].value =
        agentEnrollments.quarterAmount;
    }
  }, [agentEnrollments]);

  const handleUpdateEnrollments = async (e) => {
    e.preventDefault();

    setUpdatingEnrollments(true);

    const formData = new FormData(formRef.current);

    const updatedEnrollments = {
      cancellationCount: formData.get("cancellationCount"),
      cancellationAmount: formData.get("cancellationAmount"),
      dayCount: formData.get("dayCount"),
      dayAmount: formData.get("dayAmount"),
      pendingCount: formData.get("pendingCount"),
      pendingAmount: formData.get("pendingAmount"),
      weekCount: formData.get("weekCount"),
      weekAmount: formData.get("weekAmount"),
      monthAmount: formData.get("monthAmount"),
      quarterAmount: formData.get("quarterAmount"),
    };

    // Update the document in Firestore
    const docRef = doc(db, "enrollments", agentEnrollments.id);
    try {
      await updateDoc(docRef, updatedEnrollments);
    } catch (error) {
      console.error("Error updating enrollments: ", error);
    }

    setUpdatingEnrollments(false);
    setDisplayUpdate(false);
  };

  const handleCloseModal = () => {
    setDisplayUpdate(false);
  };

  useEffect(() => {
    console.log("agentEnrollments to update: ", agentEnrollments);
  }, [agentEnrollments]);

  return (
    <>
      <MainContainer>
        <ModalContent>
          <CloseIcon onClick={handleCloseModal}>X</CloseIcon>

          <form ref={formRef} onSubmit={handleUpdateEnrollments}>
            <TopRow>
              <AgentName>
                {agentEnrollments.fname} {agentEnrollments.lname}
              </AgentName>
            </TopRow>

            <BottomRow>
              <BottomLeftCol>
                <InputRow>
                  <Label htmlFor="cancellationCount">Cancellation #:</Label>
                  <Input
                    type="number"
                    id="cancellationCount"
                    name="cancellationCount"
                    required
                  />
                </InputRow>

                <InputRow>
                  <Label htmlFor="dayCount">Day #:</Label>
                  <Input type="number" id="dayCount" name="dayCount" required />
                </InputRow>

                <InputRow>
                  <Label htmlFor="pendingCount">Pending #:</Label>
                  <Input
                    type="number"
                    id="pendingCount"
                    name="pendingCount"
                    required
                  />
                </InputRow>

                <InputRow>
                  <Label htmlFor="weekCount">Week #:</Label>
                  <Input
                    type="number"
                    id="weekCount"
                    name="weekCount"
                    required
                  />
                </InputRow>

                <InputRow>
                  <Label htmlFor="monthAmount">Month $:</Label>
                  <Input
                    type="number"
                    id="monthAmount"
                    name="monthAmount"
                    required
                  />
                </InputRow>
              </BottomLeftCol>

              <BottomRightCol>
                <InputRow>
                  <Label htmlFor="cancellationAmount">Cancellation $:</Label>
                  <Input
                    type="number"
                    id="cancellationAmount"
                    name="cancellationAmount"
                    required
                  />
                </InputRow>

                <InputRow>
                  <Label htmlFor="dayAmount">Day $:</Label>
                  <Input
                    type="number"
                    id="dayAmount"
                    name="dayAmount"
                    required
                  />
                </InputRow>

                <InputRow>
                  <Label htmlFor="pendingAmount">Pending $:</Label>
                  <Input
                    type="number"
                    id="pendingAmount"
                    name="pendingAmount"
                    required
                  />
                </InputRow>

                <InputRow>
                  <Label htmlFor="weekAmount">Week $:</Label>
                  <Input
                    type="number"
                    id="weekAmount"
                    name="weekAmount"
                    required
                  />
                </InputRow>

                <InputRow>
                  <Label htmlFor="quarterAmount">Quarter $:</Label>
                  <Input
                    type="number"
                    id="quarterAmount"
                    name="quarterAmount"
                    required
                  />
                </InputRow>
              </BottomRightCol>
            </BottomRow>

            <BtnContainer>
              <Btn disabled={updatingEnrollments} type="submit">
                Update Enrollments
              </Btn>
            </BtnContainer>
          </form>
        </ModalContent>
      </MainContainer>
    </>
  );
};

export default EnrollmentsUpdateModal;
