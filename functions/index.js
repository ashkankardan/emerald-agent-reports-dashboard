const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const moment = require('moment-timezone');
const cors = require('cors')({ origin: true });

exports.receiveCallDetails = functions.https.onRequest(async (request, response) => {

  const ipAddress = request.headers['x-forwarded-for'] || request.connection.remoteAddress;

  const allowedOrigin = '2001:19f0:ac01:1cd4::';

  // Check if the Origin header matches the allowed origin
  if (ipAddress !== allowedOrigin) {
    response.status(403).send('Forbidden! Access NOT Allowed!!');
    return;
  }

  let callData = request.query; // or request.body if using POST

  const queues = [
    'Queue1',
    'Queue2',
    'Queue3',
    'Queue4',
    'Queue5',
    'Queue6',
    'Queue7',
    'Queue8',
    'Queue9',
    'Queue10',
    'ENGLISHXFER',
  ]

  if (!callData.group) return;
  if (!queues.includes(callData.group)) return;

  // ----- update group/queue

  if (callData.group === 'ENGLISHXFER') {
    callData.group = 11
  } else {
    const match = /(\d+)$/.exec(callData.group);
    match ? callData.group = parseInt(match[1], 10) : callData.group = 0;
  }

  // -----
  const getCurrentFormattedTime = () => {
    const format = 'hh:mm A'; // 12-hour format with AM/PM
    const timezone = 'America/Los_Angeles';
    return moment().tz(timezone).format(format);
  }

  try {
    const usersRef = admin.firestore().collection('users');
    const snapshot = await usersRef.where('viciUsername', '==', callData.agent_user_id).get();

    if (snapshot.empty) {
      console.log('No matching documents.');
      response.status(404).send('No user found with the given viciUsername.');
      return;
    }

    const user = snapshot.docs[0].data();
    const userId = user.id;

    // Add new report
    const reportsRef = admin.firestore().collection('reports');

    const newReportObj = {
      "agentId": userId,
      "createdAt": admin.firestore.FieldValue.serverTimestamp(),
      "duration": "00:00:00",
      "enrolled": false,
      "enrolledAmount": "",
      "name": "",
      "notEnoughDebt": false,
      "notes": "",
      "phone": callData.phone_number,
      "startTime": getCurrentFormattedTime(),
      "transfer": callData.group,
    }

    const docRef = await reportsRef.add(newReportObj);
    await reportsRef.doc(docRef.id).update({
      id: docRef.id
    });


    // // Add a timestamp field to the call data
    // callData.timestamp = admin.firestore.FieldValue.serverTimestamp();
    // callData.ipAddress = ipAddress

    // Save the call data with timestamp to the 'calls' collection in Firestore
    // await admin.firestore().collection('calls').add(callData);
    // console.log('Call data with timestamp saved to Firestore:', callData);

    // Respond to VICIdial
    response.send("Call data received and saved with timestamp to Firestore");
  } catch (error) {
    console.error('Error saving call data with timestamp to Firestore:', error);
    response.status(500).send("Error saving call data");
  }
});

exports.checkIP = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    // IP segment to check against
    const allowedIPStart = "2600:1700:af8:3340:";

    const requestIP = request.headers['x-forwarded-for'] || request.connection.remoteAddress;

    // Check if the request IP starts with the allowed IP segment
    if (requestIP.startsWith(allowedIPStart)) {
      response.send({ status: 'success', message: 'IP address allowed' });
    } else {
      response.status(403).send({ status: 'error', message: 'Access denied' });
    }
  });
});





// -----------------------

// exports.receiveCallDetailsInOut = functions.https.onRequest(async (request, response) => {
//   // Extracting parameters from the query string
//   const { lead_id, phone_number, agent_user_id, group } = request.query;

//   // Determine call type based on the presence of a 'group' value
//   const callType = group ? 'Inbound' : 'Outbound';

//   // Construct call data object
//   const callData = {
//     lead_id,
//     phone_number,
//     agent_user_id,
//     group,
//     callType,
//     "createdAt": admin.firestore.FieldValue.serverTimestamp(),
//   };

//   try {
//     // Save the call data to the 'calls' collection in Firestore
//     await admin.firestore().collection('calls').add(callData);
//     console.log('Call data saved to Firestore:', callData);

//     // Respond to VICIdial
//     response.send("Call data received and saved to Firestore");
//   } catch (error) {
//     console.error('Error saving call data to Firestore:', error);
//     response.status(500).send("Error saving call data");
//   }
// });
