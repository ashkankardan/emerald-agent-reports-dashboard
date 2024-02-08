const functions = require('firebase-functions');
const admin = require('firebase-admin');
const firestore = require('@google-cloud/firestore');
const firestoreClient = new firestore.v1.FirestoreAdminClient();

admin.initializeApp();
const moment = require('moment-timezone');
const cors = require('cors')({ origin: true });
const axios = require('axios');

// Initialize Twilio client
const twilio = require('twilio');
const twilioSid = functions.config().twilio.sid;
const twilioToken = functions.config().twilio.token;
const twilioClient = twilio(twilioSid, twilioToken);

const bucket = 'gs://eg-agent-reports';

exports.receiveCallDetails = functions.https.onRequest(async (request, response) => {

  const ipAddress = request.headers['x-forwarded-for'] || request.connection.remoteAddress;


  const allowedOrigin = '2001:19f0:ac01:1cd4::';
  // new 2001:19f0:6001:4eed::
  // old 2001:19f0:ac01:1cd4::

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
    // ----------------------



    // Add a timestamp field to the call data
    // callData.timestamp = admin.firestore.FieldValue.serverTimestamp();
    // callData.ipAddress = ipAddress

    // // Save the call data with timestamp to the 'calls' collection in Firestore
    // await admin.firestore().collection('calls').add(callData);
    // console.log('Call data with timestamp saved to Firestore:', callData);





    // ----------------------

    // Respond to VICIdial
    response.send("Call data received and saved with timestamp to Firestore");
  } catch (error) {
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

exports.deleteExpiredDocs = functions.pubsub.schedule('every 3 minutes').onRun((context) => {
  const now = Date.now();
  const tempURLsRef = admin.firestore().collection('tempURLs');

  return tempURLsRef.where('expiration', '<', now).get()
    .then(snapshot => {
      // Create a batch to delete all expired documents
      const batch = admin.firestore().batch();
      snapshot.forEach(doc => {
        batch.delete(doc.ref);
      });
      return batch.commit();
    })
    .catch(error => {
      console.error("Error deleting expired documents: ", error);
    });
});

exports.checkPinAndFetchDocument = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).send('Method Not Allowed');
    }

    const { pin, id } = req.body.data; // Change this line

    const docRef = admin.firestore().doc(`tempURLs/${id}`);


    try {
      const doc = await docRef.get();

      if (!doc.exists) {
        return res.status(404).send('Not Authorized: No such document');
      }

      const data = doc.data();
      const submittedPin = Number(pin);

      if (data.accessPinCode === submittedPin) {
        return res.status(200).send({ data: doc.data() });
      } else {
        await docRef.delete();
        return res.status(401).send('Not Authorized: Invalid PIN');
      }
    } catch (error) {
      return res.status(500).send('Internal Server Error');
    }
  });
});

exports.updateAndDeleteDocTempURL = functions.https.onCall(async (data, context) => {
  const { reportId, tempDocId, updatedReport } = data;

  if (!reportId || !tempDocId || !updatedReport) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing parameters');
  }

  const db = admin.firestore();
  const docRef = db.collection('reports').doc(reportId);
  const tempDocRef = db.collection('tempURLs').doc(tempDocId);

  try {
    await docRef.update(updatedReport);
    await tempDocRef.delete();
    return { result: "Update and Delete Successful" };
  } catch (error) {
    throw new functions.https.HttpsError('unknown', 'Error updating report', error);
  }
});

exports.generateTempURL = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Request had invalid credentials.');
  }

  // Validate input data
  const { reportId, agentId, toType, toPhone, toEmail } = data;
  if (!reportId || !agentId) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing required fields.');
  }

  const db = admin.firestore();
  const uid = db.collection('tempURLs').doc().id;
  const expiration = Date.now() + (3 * 60 * 1000); // 3 minutes from now
  const accessPinCode = Math.floor(10000 + Math.random() * 90000);

  const tempURLDoc = db.collection('tempURLs').doc(uid);
  const reportDoc = db.collection('reports').doc(reportId);

  // Transaction to update Firestore
  await db.runTransaction(async transaction => {
    const reportDocSnapshot = await transaction.get(reportDoc);
    if (!reportDocSnapshot.exists) {
      throw new functions.https.HttpsError('not-found', 'Report document does not exist');
    }

    transaction.update(reportDoc, { accessPinCode: accessPinCode });
    transaction.set(tempURLDoc, {
      expiration: expiration,
      id: uid,
      accessPinCode,
      reportId,
      agentId,
      "createdAt": admin.firestore.FieldValue.serverTimestamp(),
    });
  });

  // Send SMS or Email after Firestore transaction
  if (toType === 'phone' && toPhone) {
    try {
      const message = await twilioClient.messages.create({
        body: `Verification link: encryptdatatransfer.com/secured/${uid}`,
        from: '+18556702281', // Your Twilio phone number
        to: toPhone
      });
    } catch (error) {
      throw new functions.https.HttpsError('unknown', 'Failed to send SMS', error);
    }
  }

  return { accessPinCode, uid };
});

exports.searchByName = functions.https.onCall((data, context) => {
  // Check if the search term is provided
  if (!data.name) {
    throw new functions.https.HttpsError('invalid-argument', 'The function must be called with one argument "name".');
  }

  const searchTerm = data.name.toLowerCase();
  const reportsRef = admin.firestore().collection('reports');

  return reportsRef.get().then(querySnapshot => {
    const matches = [];

    querySnapshot.forEach(doc => {
      const name = doc.data().name.toLowerCase();
      if (name.includes(searchTerm)) {
        matches.push({ id: doc.id, ...doc.data() });
      }
    });

    return matches;
  }).catch(error => {
    throw new functions.https.HttpsError('unknown', 'An error occurred while searching', error);
  });
});

exports.scheduledFirestoreExport = functions.pubsub
  .schedule('every 24 hours')
  .onRun((context) => {

    const projectId = functions.config().project.id;
    if (!projectId) {
      console.error('No Project ID found');
      throw new Error('Project ID is undefined');
    }

    const databaseName = firestoreClient.databasePath(projectId, '(default)');

    // Ensure the bucket is defined
    if (!bucket) {
      console.error('No Bucket defined');
      throw new Error('Bucket is undefined');
    }

    return firestoreClient.exportDocuments({
      name: databaseName,
      outputUriPrefix: bucket,
      collectionIds: []
    })
      .then(responses => {
        const response = responses[0];
        console.log(`Operation Name: ${response['name']}`);
        return
      })
      .catch(err => {
        console.error(err);
        throw new Error('Export operation failed');
      });
  });

exports.addPhoneSuffixToReports = functions.https.onRequest(async (req, res) => {
  const reportsRef = admin.firestore().collection('reports');
  let batch = admin.firestore().batch();
  let counter = 0;

  try {
    const snapshot = await reportsRef.get();

    snapshot.forEach(doc => {
      if (counter >= 400) {
        // Commit the current batch and start a new one
        batch.commit();
        batch = admin.firestore().batch();
        counter = 0;
      }

      let phone = doc.data().phone;
      if (phone) {
        phone = phone.trim(); // Trim spaces from the phone number
        const phoneSuffix = phone.slice(-4);
        batch.update(doc.ref, { phoneSuffix });
        counter++;
      }
    });

    if (counter > 0) {
      await batch.commit(); // Commit the last batch
    }

    res.status(200).send('Updated phoneSuffix in reports successfully');
  } catch (error) {
    console.error('Error updating documents:', error);
    res.status(500).send('Error updating documents');
  }
});


exports.receiveAssignedAgent = functions.https.onRequest(async (req, res) => {

  const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress
  const allowedOrigin = '2600:1900:2000:ea::'

  // Check if the Origin header matches the allowed origin
  if (ipAddress.startsWith(allowedOrigin)) {
    res.send({ status: 'success', message: 'IP address allowed' });
  } else {
    res.status(403).send({ status: 'error', message: 'Access denied' });
  }

  const getCurrentFormattedTime = () => {
    const format = 'hh:mm A'; // 12-hour format with AM/PM
    const timezone = 'America/Los_Angeles';
    return moment().tz(timezone).format(format);
  }

  try {
    const usersRef = admin.firestore().collection('users');
    const snapshot = await usersRef.where('id', '==', req.body.reportAgentId).get();

    if (snapshot.empty) {
      res.status(404).send('No user found with the given reportAgentId.');
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
      "email": req.body.email,
      "enrolledAmount": "",
      "name": req.body.name,
      "notEnoughDebt": false,
      "notes": `Access Code: ${req.body.accessCode}`,
      'lead': true,
      "phone": req.body.phone,
      "startTime": getCurrentFormattedTime(),
      "transfer": req.body.transfer,
    }

    const docRef = await reportsRef.add(newReportObj);
    await reportsRef.doc(docRef.id).update({
      id: docRef.id
    });
    res.send("Lead data received and saved with timestamp to Firestore");
  } catch (error) {
    res.status(500).send("Error saving report data");
  }

  res.send({ result: 'Data received successfully' });
});
