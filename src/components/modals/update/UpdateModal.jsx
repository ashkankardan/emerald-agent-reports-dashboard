import React, { useRef, useEffect, useState, useContext } from "react";
import {
  doc,
  updateDoc,
  reportsRef,
  db,
  functions,
  httpsCallable,
} from "../../../config";
import {
  BottomRow,
  Btn,
  BtnContainer,
  CheckboxInput,
  CloseIcon,
  Input,
  InputRow,
  Label,
  MainContainer,
  ModalContent,
  PinText,
  SelectInput,
  SentUrlBtn,
  TextArea,
  TopLeftCol,
  TopRightCol,
  TopRow,
} from "./UpdateModal.styles";
import { UserContext } from "../../../contexts/user-context";
import axios from "axios";
import LogoMotion from "../../logo-motion/LogoMotion";
import VerificationModal from "../verification/VerificationModal";

const UpdateModal = ({ setDisplayUpdate, report }) => {
  const [updatingReport, setUpdatingReport] = useState(false);
  const [duration, setDuration] = useState("");
  const [startTime, setStartTime] = useState("");
  const [tempAccessPinCode, setTempAccessPinCode] = useState(null);
  const [ssn, setSsn] = useState("");
  const [dob, setDob] = useState(
    new Date().toLocaleDateString("en-CA", { timeZone: "America/Los_Angeles" })
  );
  const [verificationModal, setVerificationModal] = useState("none");

  const { user } = useContext(UserContext);
  const formRef = useRef(null);

  const EMAILJS_SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID;
  const EMAILJS_TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
  const EMAILJS_PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;
  const SECURED_URL = process.env.REACT_APP_SECURED_URL;

  const generateURL = (toType) => {
    setUpdatingReport(true);

    const toEmail = formRef.current.elements["email"].value;
    const toPhone = formRef.current.elements["phone"].value;

    const generateTempURL = httpsCallable(functions, "generateTempURL");

    generateTempURL({
      reportId: report.id,
      agentId: user.id,
      toType,
      toPhone,
      toEmail,
    })
      .then((result) => {
        setTempAccessPinCode(result.data.accessPinCode);

        if (toType === "email" && toEmail) {
          sendEmail(toEmail, result.data.uid);
        }
      })
      .catch((error) => {
        console.error("Error generating URL:", error);
      });

    setVerificationModal("none");
  };

  // Setting default values when the component mounts
  useEffect(() => {
    if (report && formRef.current) {
      formRef.current.elements["phone"].value = report.phone || "";
      formRef.current.elements["name"].value = report.name || "";
      formRef.current.elements["email"].value = report.email || "";
      formRef.current.elements["dob"].value = report.dob || "";
      setDob(report.dob || "");
      formRef.current.elements["ssn"].value = report.ssn || "";
      setSsn(report.ssn || "");
      formRef.current.elements["start-time"].value = report.startTime || "";
      setStartTime(report.startTime || "");
      formRef.current.elements["duration"].value = report.duration || "";
      setDuration(report.duration || "");
      formRef.current.elements["notes"].value = report.notes || "";
      formRef.current.elements["enrolled"].checked = report.enrolled === true;
      if (formRef.current.elements["lead"] && report.hasOwnProperty("lead")) {
        formRef.current.elements["lead"].checked = report.lead === true;
      }
      if (user.department !== "tax") {
        formRef.current.elements["enrolled-amount"].value =
          report.enrolledAmount || "";
        formRef.current.elements["notEnoughDebt"].checked =
          report.notEnoughDebt || false;
      } else {
        formRef.current.elements["state-liability"].value =
          report.stateLiability || "";

        formRef.current.elements["federal-liability"].value =
          report.federalLiability || "";
      }
      formRef.current.elements["transfer"].value = report.transfer || 1;
    }
  }, [report]);

  const handleAddReport = async (e) => {
    e.preventDefault();

    setUpdatingReport(true);

    const formData = new FormData(formRef.current);
    const rawPhone = formData.get("phone");
    const phone = rawPhone.trim();
    const updatedReport = {
      phone,
      name: formData.get("name"),
      email: formData.get("email"),
      startTime,
      duration,
      notes: formData.get("notes"),
      enrolled: formData.get("enrolled") === "on",
      lead: formData.get("lead") === "on",
      enrolledAmount: formData.get("enrolled-amount"),
      stateLiability: formData.get("state-liability"),
      federalLiability: formData.get("federal-liability"),
      notEnoughDebt: formData.get("notEnoughDebt") === "on",
      transfer: parseInt(formData.get("transfer"), 10),
      phoneSuffix: phone.slice(-4),
    };

    // Update the document in Firestore
    const docRef = doc(db, "reports", report.id);
    try {
      await updateDoc(docRef, updatedReport);
    } catch (error) {
      console.error("Error updating report: ", error);
    }

    setUpdatingReport(false);
    setDisplayUpdate(false);
  };

  const handleCloseModal = () => {
    setDisplayUpdate(false);
  };

  function formatDuration(input) {
    let numbers = input.replace(/[^\d]/g, ""); // Remove non-numeric characters
    if (numbers.length > 6) {
      numbers = numbers.substr(0, 6); // Limit string length to 6 digits
    }
    const parts = [];
    for (let i = 0; i < numbers.length; i += 2) {
      parts.push(numbers.substr(i, 2));
    }
    return parts.join(":");
  }

  const handleDurationChange = (event) => {
    const formatted = formatDuration(event.target.value);
    setDuration(formatted);
  };

  function formatStartTime(input) {
    let cleanInput = input.toUpperCase().replace(/[^0-9APM]/g, "");

    // Extract numbers and AM/PM part
    let numbers = cleanInput.replace(/[APM]/g, "");
    let amPm = cleanInput.match(/[APM]+/)?.[0] || "";

    // Limit string length to 4 digits for time
    if (numbers.length > 4) {
      numbers = numbers.substr(0, 4);
    }

    let formattedTime =
      numbers.length > 2
        ? `${numbers.substr(0, 2)}:${numbers.substr(2)}`
        : numbers;

    if (amPm.length > 0) {
      formattedTime += " " + amPm.substr(0, 2); // Take only the first two characters of AM/PM part
    }

    return formattedTime;
  }

  const handleStartTimeChange = (event) => {
    const formatted = formatStartTime(event.target.value);
    setStartTime(formatted);
  };

  const handleSsnChange = (event) => {
    const { value } = event.target;
    let formattedInput = value.replace(/\D/g, ""); // Remove non-digits

    // Add dashes for SSN format (XXX-XX-XXXX)
    if (formattedInput.length > 3 && formattedInput.length <= 5) {
      formattedInput =
        formattedInput.slice(0, 3) + "-" + formattedInput.slice(3);
    } else if (formattedInput.length > 5) {
      formattedInput =
        formattedInput.slice(0, 3) +
        "-" +
        formattedInput.slice(3, 5) +
        "-" +
        formattedInput.slice(5, 9);
    }

    setSsn(formattedInput);
  };

  const sendEmail = async (toEmail, DocId) => {
    const emailData = {
      service_id: EMAILJS_SERVICE_ID,
      template_id: EMAILJS_TEMPLATE_ID,
      user_id: EMAILJS_PUBLIC_KEY,
      template_params: {
        email: toEmail,
        url: `${SECURED_URL}${DocId}`,
      },
    };

    try {
      await axios.post(
        "https://api.emailjs.com/api/v1.0/email/send",
        emailData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("Email sent successfully");
    } catch (error) {
      // Log and throw any errors encountered
      console.error("Error sending email:", error);
    }
  };

  return (
    <>
      <MainContainer>
        <ModalContent>
          <CloseIcon onClick={handleCloseModal}>X</CloseIcon>

          <form ref={formRef} onSubmit={handleAddReport}>
            <TopRow>
              <TopLeftCol>
                <InputRow>
                  <Label htmlFor="transfer">Transfer:</Label>
                  <SelectInput name="transfer" id="transfer" required>
                    {[...Array(12)].map((_, index) => (
                      <option key={index} value={index + 1}>
                        {index + 1}
                      </option>
                    ))}
                  </SelectInput>
                </InputRow>

                <InputRow>
                  <Label htmlFor="phone">Phone:</Label>
                  <Input
                    type="text"
                    id="phone"
                    name="phone"
                    placeholder="Phone"
                    required
                  />
                </InputRow>
                <InputRow>
                  <Label htmlFor="email">Email:</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="john.doe@email.com"
                  />
                </InputRow>
                <InputRow>
                  <Label htmlFor="name">Name:</Label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Name"
                    required
                  />
                </InputRow>
                <InputRow>
                  <Label htmlFor="start-time">Start Time:</Label>
                  <Input
                    id="start-time"
                    required
                    type="text"
                    name="start-time"
                    value={startTime}
                    onChange={handleStartTimeChange}
                    placeholder="00:00 AM"
                    maxLength="11"
                  />
                </InputRow>
                <InputRow>
                  <Label htmlFor="duration">Duration:</Label>
                  <Input
                    type="text"
                    id="duration"
                    name="duration"
                    required
                    value={duration}
                    placeholder="00:00:00"
                    onChange={handleDurationChange}
                    maxLength="8"
                  />
                </InputRow>

                <InputRow>
                  <Label htmlFor="lead">Lead:</Label>
                  <CheckboxInput type="checkbox" id="lead" name="lead" />
                </InputRow>
              </TopLeftCol>

              <TopRightCol>
                <InputRow>
                  <Label htmlFor="dob">Date of Birth:</Label>
                  <Input
                    type="date"
                    id="dob"
                    name="dob"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    required
                  />
                </InputRow>
                <InputRow>
                  <Label htmlFor="ssn">SSN:</Label>
                  <Input
                    type="text"
                    id="ssn"
                    name="ssn"
                    value={ssn}
                    onChange={handleSsnChange}
                    maxLength="11" // 9 digits + 2 dashes
                    placeholder="XXX-XX-XXXX"
                    required
                  />
                </InputRow>

                <InputRow>
                  <Label htmlFor="enrolled">Enrolled:</Label>
                  <CheckboxInput
                    type="checkbox"
                    id="enrolled"
                    name="enrolled"
                  />
                </InputRow>

                {user.department !== "tax" ? (
                  <>
                    <InputRow>
                      <Label htmlFor="notEnoughDebt">Not Enough Debt:</Label>
                      <CheckboxInput
                        type="checkbox"
                        id="notEnoughDebt"
                        name="notEnoughDebt"
                      />
                    </InputRow>
                    <InputRow>
                      <Label htmlFor="enrolled-amount">Enrolled Amount:</Label>
                      <Input
                        id="enrolled-amount"
                        type="text"
                        name="enrolled-amount"
                        placeholder="Enrolled Amount"
                      />
                    </InputRow>
                  </>
                ) : (
                  <>
                    <InputRow>
                      <Label htmlFor="state-liability">State Liability:</Label>
                      <Input
                        type="text"
                        id="state-liability"
                        name="state-liability"
                        placeholder="State Liability"
                      />
                    </InputRow>
                    <InputRow>
                      <Label htmlFor="federal-liability">
                        Federal Liability:
                      </Label>
                      <Input
                        type="text"
                        id="federal-liability"
                        name="federal-liability"
                        placeholder="Federal Liability"
                      />
                    </InputRow>
                  </>
                )}

                <InputRow>
                  <Label>Send Secure URL:</Label>
                  {updatingReport ? (
                    <LogoMotion size="small" />
                  ) : (
                    <>
                      <SentUrlBtn onClick={() => setVerificationModal("email")}>
                        Email
                      </SentUrlBtn>
                      <SentUrlBtn onClick={() => setVerificationModal("phone")}>
                        SMS
                      </SentUrlBtn>
                    </>
                  )}
                </InputRow>

                <InputRow>
                  <Label>Access Pin Code:</Label>
                  <PinText>{tempAccessPinCode && tempAccessPinCode}</PinText>
                </InputRow>
              </TopRightCol>
            </TopRow>

            <BottomRow>
              <Label htmlFor="notes">Notes:</Label>
              <TextArea
                name="notes"
                id="notes"
                placeholder="Notes"
                required
              ></TextArea>
            </BottomRow>

            <BtnContainer>
              <Btn disabled={updatingReport} type="submit">
                Update Report
              </Btn>
            </BtnContainer>
          </form>
        </ModalContent>
      </MainContainer>

      {verificationModal !== "none" && (
        <VerificationModal
          verificationModal={verificationModal}
          setVerificationModal={setVerificationModal}
          generateURL={generateURL}
        />
      )}
    </>
  );
};

export default UpdateModal;
