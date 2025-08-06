const functions = require("firebase-functions/v2");
const admin = require("firebase-admin");
const {JWT} = require("google-auth-library");
const key = {
  "type": "service_account",
  "project_id": "dared-prototype",
  "private_key_id": "2ad5223711b7157a5f926f88d67c1f07d4acbb69",
  "private_key":
  "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwgg" +
  "SjAgEAAoIBAQDnRE/BnMlOFgNO" +
  "\n8JrNMRooW+WJEk0NAlnk1CdxMLsfd9c20Ifi76g8GFdPgzIx1XtfLbEycX/QpVsL\n7rJ"+
  "dHwOvdjGZWbwlT7IrSZtFUQkePPADSdTY7+QyKWTIeVBJ4IUZ2S8xhGvC1z/f\nS0XG4pNoD" +
  "uobLGoTvp41WYfUPkpgxsTiWianexyFYmHpraAu7xus6XJS8EV0Yt+t\nVXgAsXIxLvZhrCrR" +
  "xk83/e+EGPj8yhC1YHdlLkVWeFk6jedX19yK5Jy45QTTJZNO\nrtGtkHT5hr/rG/qGXYVj2xO" +
  "dwBcwAjH/pYqZkx0g+IKM5W66yWwXx0F3CjOt7El1\nn0m1Yn1DAgMBAAECggEAbazPxhn8v" +
  "bNizkT8pOLsbMdoC6FKOSksSID0U5GwrDPB\nNJWgW9ccCaPhhCvL2iZL489fgXSiEOjaTMZe" +
  "gBr9PHDpBLixqWAqNq0pna3YjSaJ\nDIYvEtJxffhzez9M/Dwl4yREZU9Pa495EwQ3iyJYlbi"+
  "8/TYK+GIl1VcoO1dvHoU+\ngD/7KEnvqMrM5DcCX3bkhzIoh0hBohhiRrURfXh8LhjPmGeuuDe3"+
  "NVQDJr1vbspf\nUy57hjWVZcP90p4+0MFLsYUL5PQhQN0Arv5g9g0pYZYZJ3WTCmwKioMYrbYA"+
  "WeDR\nZInT8cgbqDATEDJ2zTrdyFksy/cIT4rwT+rJNGYRQQKBgQD0USFM1g4HVM109S1v\nM"+
  "SDvILHjJyhHRUEDriUyWU61HhGw//1h0YB+L8WBGBig3/MJMpCO0jqd24IXz6HM\n5P+hYH"+
  "fXdb2umeABz8mqNYyDPkNKzT6omrjawT0w3lqb14DQleFNsQkXIeChTIDP\n9Dwy3ul7T7"+
  "0z8pkZ9T2B8oGu3QKBgQDyU2zx/8YbS6TkIiIr7hyv9QADMwXtGRtd\nnmUeKYLQye4s7"+
  "Lnc1gwZA2I0WJ+gTFXCiiT9KQzcsgnL8HT0Tc+g0VRYUoHCP+Ak\n3mJJw2oE+6WNQRAJx"+
  "B02aMfmbltqeky0Msi2+ydmh4etD5Xq4t9efe6qohi1nLkg\nH+MOV0dKnwKBgQCvgNAxB9"+
  "tP/OUSTUV0CJCl9pCSooBWojMP17s0rd7SUGVZBqsX\n540sGFkCYTLf7cACLWaWkgI1f"+
  "4e2XxrVuvK/FDNCfXvivvqhkohFUu47ITDpvQJz\nz6FW01WHk1L3fBk2vVP5oWDsUxOw"+
  "CurFd6b+zA5g3GkHtg+xC/BBNtldqQKBgAiN\nazXrSgmilNI8ZipYwAhxxCtYvKfOkA"+
  "mw0m7LFkPaLJ7HSBQENe8YEHo6en/E0e4I\nxB9vOHX9jpz1Apuwt1g8qxZm6w95A6cp"+
  "dhyWWgKNAx3GIxPFKSbHce6vDGjoohZm\nCHF00cIrnF0+RJNCqJGELk01ZVvbiSkaFw"+
  "Blki2PAoGAHbxhk6NuB0Imdn7h3jrg\n+gRVGL/kkuvlrBndcFhgShPMDFVPUbsSAj+l"+
  "UlBTpiJ/hrI6Eh5pSKWd2qv85okt\nkH8Qd6B8nZjfLtr3AgOh8V9/FFvB9wYT+qINX"+
  "8BpV6jD7cVMoMaB7z5Su3v4neh2\nhjt0gOAGn649xr2Wx"+
  "12KwsQ=\n-----END PRIVATE KEY-----\n",
  "client_email":
  "firebase-adminsdk-k1str@dared-prototype.iam.gserviceaccount.com",
  "client_id": "108007904269295731796",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-k1str%40dared-prototype.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com",
};


admin.initializeApp();


exports.sendNotificationOnComment = functions.firestore
    .onDocumentCreated("comments/{commentID}", async (event) => {
      const eventData = event.data.data();
      const commentedOnPostOwner = eventData.submissionOwnerId;
      const userSnapShot = await admin.firestore().collection("users").get();
      const userDoc = userSnapShot.docs.filter(
          (user) => user.id === commentedOnPostOwner);
      const pushToken = userDoc.length > 0 ?
      userDoc[0].data().pushToken.data : "";
      const getAccessTokenAsync = (key) => {
        return new Promise((resolve, reject) => {
          const jwtClient = new JWT(
              key.client_email,
              null,
              key.private_key,
              ["https://www.googleapis.com/auth/cloud-platform"],
              null,
          );
          jwtClient.authorize((err, tokens) => {
            if (err) {
              reject(err);
              return;
            }
            resolve(tokens.access_token);
          });
        });
      };

      const firebaseAccessToken = await getAccessTokenAsync(key);
      const messageBody = {
        message: {
          token: pushToken,
          data: {
            channelId: "default",
            message: "New Comment!",
            title: `${eventData.userName} has commented on your Dare!`,
            priority: "high",
            body: JSON.stringify(
                {
                  submissionId: eventData.submissionId,
                }),
            scopeKey: "@nika_r/daredprototype",
            experienceId: "@nika_r/daredprototype",
          },
        },
      };
      try {
        const res = await fetch(
            `https://fcm.googleapis.com/v1/projects/dared-prototype/messages:send`,
            {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${firebaseAccessToken}`,
                "Accept": "application/json",
                "Accept-encoding": "gzip, deflate",
                "Content-Type": "application/json",
              },
              body: JSON.stringify(messageBody),
            },
        );
        console.log("FCM SENT successfully", res.data, await res.json());
      } catch (e) {
        console.log("FCM SENT WITH ERROR", e);
      }
    });


exports.sendNotificationOnNewChallenge = functions.firestore
    .onDocumentCreated("challenges/{challengeID}", async (event) => {
      const usersSnapshot = await admin.firestore().collection("users").get();
      const pushTokens = usersSnapshot.docs.map((el) => {
        return el.data().pushToken.data;
      });

      const getAccessTokenAsync = (key) => {
        return new Promise((resolve, reject) => {
          const jwtClient = new JWT(
              key.client_email,
              null,
              key.private_key,
              ["https://www.googleapis.com/auth/cloud-platform"],
              null,
          );
          jwtClient.authorize((err, tokens) => {
            if (err) {
              reject(err);
              return;
            }
            resolve(tokens.access_token);
          });
        });
      };

      const firebaseAccessToken = await getAccessTokenAsync(key);
      const messages = [];
      const FCMmessages = [];

      pushTokens.forEach((pushToken) => {
        if (pushToken) {
          messages.push({
            to: pushToken,
            sound: "default",
            title: "New Challenge!",
            body: "A new challenge has been created!",
            data: {
              challengeId: event.data.id,
              challenge: event.data.data().challenge,
            },
          });
          const messageBody = {
            message: {
              token: pushToken,
              data: {
                channelId: "default",
                message: "New Challenge!",
                title: `A new challenge has been created!`,
                priority: "high",
                body: JSON.stringify(
                    {
                      challendeId: event.data.id,
                      challenge: event.data.data().challenge,
                    }),
                scopeKey: "@nika_r/daredprototype",
                experienceId: "@nika_r/daredprototype",
              },
            },
          };
          FCMmessages.push(messageBody);
        } else {
          console.log("Not a push token");
        }
      });

      FCMmessages.forEach(async (message) => {
        try {
          const res = await fetch(
              `https://fcm.googleapis.com/v1/projects/dared-prototype/messages:send`,
              {
                method: "POST",
                headers: {
                  "Authorization": `Bearer ${firebaseAccessToken}`,
                  "Accept": "application/json",
                  "Accept-encoding": "gzip, deflate",
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(message),
              },
          );
          console.log("FCM SENT successfully", res.data, await res.json());
        } catch (e) {
          console.log("FCM SENT WITH ERROR", e);
        }
      });
    });
