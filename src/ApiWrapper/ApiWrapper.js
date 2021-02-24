import { v4 as uuidv4 } from 'uuid';
// import downloadjs from 'downloadjs';
import firebase, { db, analytics, storage } from '../Firebase.js';

const DEFAULT_LABEL = {
  //TODO: is _id needed, or is it just needed for electron database?
  _id: 'default',
  id: 'default',
  projectId: 'default',
  value: 'default',
  label: 'Default',
  color: 'orange',
  description: 'A default label',
};

class ApiWrapper {
  // constructor  () {
  //     const { currentUser } = await firebase.auth();
  //   const currentUserUid = currentUser.uid;
  // firebase.analytics().setUserProperties({ favorite_food: 'apples' });
  // analytics.logEvent('goal_completion', { name: 'lever_puzzle'});
  // }

  /**
   * Projects
   */
  async getAllProjects() {
    const { currentUser } = await firebase.auth();
    const currentUserUid = currentUser.uid;
    analytics.logEvent('getAllProjects', 'd');
    return new Promise((resolve, reject) => {
      db.collection('projects')
        // Temporary solution to match users with projects.
        // TODO: figure out how to enforce these in firestore.
        // There seems to be a known bug in fireestore using `get` and `exists` in firestore rules?
        // TODO: also figure out how to extened/modify this, to support multiple users on the same project? eg array instead of string. Also in project create
        // .where('user', '==', currentUser.email)
        .get()
        .then((querySnapshot) => {
          let list = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            // Temporary way to only show the user their projects
            // TODO: it be better to make this more secure, using where compound query.
            // as well as using firestore queries for this
            if (data.roles[currentUser.email]) {
              const tmpData = {
                id: doc.id,
                ...data,
              };
              list.push(tmpData);
            }
          });
          resolve(list);
          return list;
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  async getProject(id) {
    const { currentUser } = await firebase.auth();
    firebase.analytics().logEvent('getProject', { projectId: id });
    return new Promise((resolve, reject) => {
      const docRef = db.collection('projects').doc(id);
      docRef
        .get()
        .then((doc) => {
          // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/in
          if (doc.exists) {
            // && currentUser.email in doc.data().roles
            const tmpData = doc.data();
            const tmpResult = { project: tmpData };
            // TODO: also need to get transcript associated with project
            // TODO: first do the create transcript within a project ApiWrapper
            // TODO: also need to get paper-edits for project
            resolve(tmpResult);
          } else {
            console.log('No such document! getProject 1');
            reject('No such document! getProject 2');
          }
        })
        .catch((error) => {
          console.log('Error getting document getProject: 3', error);
          reject('No such document! getProject 4');
        });
    });
  }

  async createProject(data) {
    const { currentUser } = await firebase.auth();
    const currentUserEmail = currentUser.email;
    const roles = {};
    roles[currentUserEmail] = 'owner';
    return new Promise((resolve, reject) => {
      db.collection('projects')
        .add({
          roles,
          title: data.title,
          description: data.description,
          status: 'in-progress',
          created: firebase.firestore.FieldValue.serverTimestamp(),
          updated: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(async (docRef) => {
          console.log('Document written with ID: ', docRef.id);
          const response = {};
          response.status = 'ok';
          response.project = {
            id: docRef.id,
            title: data.title,
            description: data.description,
          };

          // create default label for project
          await this.createLabel(docRef.id, DEFAULT_LABEL);

          resolve(response);
        })
        .catch(function (error) {
          console.error('Error adding document: ', error);
          reject(error);
        });
    });
  }

  async updateProject(id, data) {
    return new Promise((resolve, reject) => {
      const docRef = db.collection('projects').doc(id);
      const tmpData = data;
      tmpData.updated = firebase.firestore.FieldValue.serverTimestamp();

      docRef
        .set(tmpData, { merge: true })
        .then((doc) => {
          resolve({ status: 'ok', project: data });
        })
        .catch((error) => {
          console.error('Error getting document:', error);
          reject('No such document updateProject!');
        });
    });
  }

  async deleteProject(id) {
    return new Promise((resolve, reject) => {
      // Delete projects
      db.collection('projects')
        .doc(id)
        .delete()
        .then(() => {
          console.log('Document successfully deleted!');
          resolve({ ok: true });
        })
        .catch((error) => {
          console.error('Error removing document: ', error);
          reject(error);
        });
    });
  }

  /**
   * Transcripts
   */
  async getTranscripts(projectId) {
    // TODO: handle edge case transcript collection has not been created yet
    return new Promise((resolve, reject) => {
      const transcriptRef = db.collection('projects').doc(projectId).collection('transcripts');

      transcriptRef
        .get()
        .then((querySnapshot) => {
          if (querySnapshot.docs.length > 0) {
            const transcripts = querySnapshot.docs.map((doc) => {
              // console.log('doc.data()', doc.data(), doc.id);
              const tmpData = doc.data();
              // tmpData.transcript = { paragraphs: tmpData.paragraphs, words: tmpData.words };
              // delete tmpData.paragraphs;
              // delete tmpData.words;
              // Add the individual transcript firebase id to the data
              console.log('tmpData getTranscripts', tmpData);
              return {
                id: doc.id,
                ...tmpData,
              };
            });

            resolve({
              ok: true,
              transcripts,
            });
          }
        })
        .catch(function (error) {
          console.log('Error getting documents: ', error);
          reject(error);
        });
    });
  }

  async createTranscript(projectId, formData, data, updateProgressValue) {
    // TODO: send file to google cloud storate
    const title = formData.get('title');
    const description = formData.get('description');
    const type = formData.get('type');
    const clipName = formData.get('file').name;

    const selectedFile = formData.get('file');

    const storageRefFileName = `${uuidv4()}-${clipName}`;
    //add folder path, eg /{projectId}/...
    const storageRefName = `${projectId}/${storageRefFileName}`;
    const storageRef = firebase.storage().ref();
    const fileRef = storageRef.child(storageRefName);
    // TODO: could add metadata - firebase.storage.child(path).put(file, metadata);  ?
    const uploadTask = fileRef.put(selectedFile);

    return new Promise((resolve, reject) => {
      // First upload the file
      // then create the firestore entity
      // to avoid race condition, with the cloud function
      // that is triggered on transcript create. In case media is not availabel coz still uploading.

      // https://firebase.google.com/docs/storage/web/upload-files
      // Listen for state changes, errors, and completion of the upload.
      // https://firebase.google.com/docs/storage/web/upload-files
      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
        function (snapshot) {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          updateProgressValue(progress);
          // setUploadProgress(progress);
          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
              console.log('Upload is paused');
              break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
              console.log('Upload is running');
              break;
            default:
              console.error('Error with upload to firebase');
              break;
          }
        },
        function (error) {
          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
          switch (error.code) {
            case 'storage/unauthorized':
              // User doesn't have permission to access the object
              console.error(error.code);
              break;
            case 'storage/canceled':
              // User canceled the upload
              console.error(error.code);
              break;
            case 'storage/unknown':
              // Unknown error occurred, inspect error.serverResponse
              console.error(error.code);
              break;
            default:
              console.error('Error with upload to firebase', error);
              break;
          }
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            const newTranscript = {
              projectId,
              title,
              description,
              type,
              clipName,
              storageRefName,
              downloadURL,
              display: true,
              // paragraphs: [],
              // words: [],
              status: 'in-progress',
              created: firebase.firestore.FieldValue.serverTimestamp(),
              updated: firebase.firestore.FieldValue.serverTimestamp(),
            };
            // create firebase entity
            db.collection('projects')
              .doc(projectId)
              .collection('transcripts')
              .add(newTranscript)
              .then(async (docRef) => {
                console.log('Document written with ID: ', docRef.id);
                const response = {};
                response.status = 'ok';
                response.transcriptId = docRef.id;
                response.transcript = {
                  ...newTranscript,
                  id: docRef.id,
                };

                resolve(response);
                // updating metadata with custom fields, to
                // set with project and transcript it belongs to
                // This triggers cloud function to create mp4 preview
                // and update firestore with ref of the mp4 video preview
                // fileRef
                //   .updateMetadata({
                //     customMetadata: {
                //       projectId: projectId,
                //       transcriptId: docRef.id,
                //     },
                //   })
                //   .then(resp => {
                //      resolve(resp);
                // })
                // .catch(er => {
                //   reject(er);
                // });
              })
              .catch(function (error) {
                console.error('Error adding document: ', error);
                reject(error);
              });
            // end - create firebase entity
          });
        }
      );
    });
  }

  async getTranscript(projectId, transcriptId, queryParamsOptions) {
    return new Promise(async (resolve, reject) => {
      const projectRef = db.collection('projects').doc(projectId);
      const project = await projectRef.get();
      const projectData = project.data();

      const transcriptRef = db.collection('projects').doc(projectId).collection('transcripts').doc(transcriptId);

      transcriptRef
        .get()
        .then(async (doc) => {
          if (doc.exists) {
            const tmpData = doc.data();
            // In casee the url of the media expires, getting a new getDownloadURL from ref in cloud storage
            let pathReference = storage.ref(tmpData.storageRefName);
            if (tmpData.videoUrl) {
              pathReference = storage.ref(tmpData.videoUrl);
            } else if (tmpData.audioUrl) {
              pathReference = storage.ref(tmpData.audioUrl);
            }

            // Getting collections for words and transcripts
            const wordsRef = db.collection('projects').doc(projectId).collection('transcripts').doc(transcriptId).collection('words').doc('words');

            const wordRefSnapShot = await wordsRef.get();
            const words = await wordRefSnapShot.data().words;

            const paragraphsRef = db
              .collection('projects')
              .doc(projectId)
              .collection('transcripts')
              .doc(transcriptId)
              .collection('paragraphs')
              .doc('paragraphs');

            const paragraphsRefSnapShot = await paragraphsRef.get();
            const paragraphs = await paragraphsRefSnapShot.data().paragraphs;

            const transcript = {
              paragraphs,
              words,
            };
            // console.log('transcript', transcript);
            // TODO: or could get it from the audio that is sent to STT
            // to ensure HTML5 compatibility, if non HTML5 audio/video is being uploaded as source file
            // const pathReference = storage.ref(tmpData.audioUrl);
            pathReference
              .getDownloadURL()
              .then((url) => {
                const tmpResult = {
                  id: doc.id,
                  projectTitle: projectData.title,
                  transcriptTitle: tmpData.title,
                  // TODO: integrate with transcript json data
                  // transcript: { paragraphs: tmpData.paragraphs, words: tmpData.words },

                  transcript,
                  // TODO: integrate with cloud storage url data
                  // TODO: change this for url of video / audio preview (mp4 or wav)
                  // url: tmpData.downloadURL,
                  url,
                  // TODO: add clipName
                  clipName: tmpData.clipName,
                  status: tmpData.status,
                };
                // TODO: also need to get transcript associated with project
                // TODO: first do the create transcript within a project ApiWrapper
                // TODO: also need to get paper-edits for project
                resolve(tmpResult);
              })
              .catch(function (error) {
                // Handle any errors
                console.log('No such document! getTranscript');
                reject('No such document! getTranscript');
              });
          } else {
            // doc.data() will be undefined in this case
            console.log('No such document! getTranscript');
            reject('No such document! getTranscript');
          }
        })
        .catch(function (error) {
          console.log('Error getting document: getTranscript', error);
          reject('No such document! getTranscript error');
        });
    });
  }

  async updateTranscript(projectId, transcriptId, queryParamsOptions, data) {
    // TODO: there mgiht be a better way to do this.
    // this being avoiding sending client side info to the
    const { display, status } = data;
    delete data.display;
    delete data.status;
    console.log('updateTranscript', projectId, transcriptId, queryParamsOptions, data);
    // const res = await corsFetch(this.transcriptsIdUrl(projectId, transcriptId, queryParamsOptions), 'PUT', data);
    // if only updating title or descrition

    // return res;
    console.log('queryParamsOptions, data', queryParamsOptions, data);
    return new Promise((resolve, reject) => {
      const docRef = db.collection('projects').doc(projectId).collection('transcripts').doc(transcriptId);

      if (data.words && data.paragraphs) {
        const tmpData = data;
        const { words, paragraphs } = data;
        console.log('words', words);
        console.log('paragraphs', paragraphs);
        delete tmpData.words;
        delete tmpData.c;
        const updated = firebase.firestore.FieldValue.serverTimestamp();
        // const { paragraphs, words } = data;

        const wordsRef = db
          .collection('projects')
          .doc(projectId)
          .collection('transcripts')
          .doc(transcriptId)
          .collection('words')
          .doc('words')
          .set({ words }, { merge: true });

        const paragraphsRef = db
          .collection('projects')
          .doc(projectId)
          .collection('transcripts')
          .doc(transcriptId)
          .collection('paragraphs')
          .doc('paragraphs')
          .set({ paragraphs }, { merge: true });
      }
      docRef
        .set(data, { merge: true })
        .then((doc) => {
          // TODO: inconsistencies in the interface, some return ok boolean attribute, others status 'ok' string
          data.status = status;
          data.display = display;
          resolve({ ok: true, status: 'ok', transcript: data });
        })
        .catch((error) => {
          console.log('Error getting document:', error);
          reject('No such document updateTranscript!');
        });
    });
  }

  async deleteTranscript(projectId, transcriptId) {
    return new Promise(async (resolve, reject) => {
      const projectsRef = db.collection('projects').doc(projectId);
      const transcriptRef = projectsRef.collection('transcripts').doc(transcriptId);
      console.log('transcriptRef', transcriptRef);
      transcriptRef
        .delete()
        .then(() => {
          console.log('Document successfully deleted!');
          resolve({ ok: true });
        })
        .catch((error) => {
          console.error('Error removing document: ', error);
          reject(error);
        });
    });
  }

  /**
   * Annotations
   */
  async getAllAnnotations(projectId, transcriptId) {
    console.log('getAllAnnotations projectId', projectId, 'transcriptId', transcriptId);
    return new Promise((resolve, reject) => {
      if (transcriptId) {
        const projectRef = db.collection('projects').doc(projectId);
        console.log('projectRef', projectRef);

        const transcriptRef = projectRef.collection('transcripts').doc(transcriptId);
        console.log('transcriptRef', transcriptRef);
        const annotationsRef = transcriptRef.collection('annotations');
        console.log('annotationsRef', annotationsRef);

        annotationsRef
          .get()
          .then((querySnapshot) => {
            if (querySnapshot.docs.length > 0) {
              const annotations = querySnapshot.docs.map((doc) => {
                // Add the individual transcript firebase id to the data
                return {
                  id: doc.id,
                  ...doc.data(),
                };
              });

              resolve({
                ok: true,
                annotations,
              });
            } else {
              resolve({
                ok: true,
                annotations: [],
              });
            }
          })
          .catch(function (error) {
            console.log('Error getting documents: ', error);
            reject(error);
          });
      } else {
        resolve({
          ok: true,
          annotations: [],
        });
      }
    });
  }

  // not used
  async getAnnotation(projectId, transcriptId, annotationId) {
    // const res = await corsFetch(this.annotationsIdUrl(projectId, transcriptId, annotationId));
    // const json = await res.json();
    // return json;
  }

  async createAnnotation(projectId, transcriptId, data) {
    return new Promise((resolve, reject) => {
      const newAnnotation = {
        projectId,
        ...data,
        projectId,
        transcriptId,
        created: firebase.firestore.FieldValue.serverTimestamp(),
        updated: firebase.firestore.FieldValue.serverTimestamp(),
      };
      // return
      db.collection('projects')
        .doc(projectId)
        .collection('transcripts')
        .doc(transcriptId)
        .collection('annotations')
        .add(newAnnotation)
        .then((docRef) => {
          const annotationId = docRef.id;
          newAnnotation.id = annotationId;
          //TODO: is _id needed, or is it just needed for electron database?
          newAnnotation._id = annotationId;
          // this.updateAnnotation(projectId, transcriptId, annotationId, newAnnotation);
          resolve({ ok: true, status: 'ok', annotation: newAnnotation });
        })
        .catch(function (error) {
          console.error('Error adding document: ', error);
          reject(error);
        });
    });
  }

  async updateAnnotation(projectId, transcriptId, annotationId, data) {
    // TODO: not sure why projectId is undefined?
    return new Promise((resolve, reject) => {
      const docRef = db
        .collection('projects')
        .doc(data.projectId)
        .collection('transcripts')
        .doc(transcriptId)
        .collection('annotations')
        .doc(annotationId);

      const tmpData = data;
      tmpData.updated = firebase.firestore.FieldValue.serverTimestamp();

      docRef
        .set(tmpData, { merge: true })
        .then((doc) => {
          // TODO: Is this call to get all labels needed, is it actually used by the client,
          // or can we just return  { ok: true, status: 'ok' }
          // const resp = this.getAllLabels(projectId);
          resolve({ ok: true, status: 'ok', annotation: tmpData });
        })
        .catch((error) => {
          console.log('Error getting document updateAnnotation:', error);
          reject('No such document! updateAnnotation');
        });
    });
  }

  async deleteAnnotation(projectId, transcriptId, annotationId) {
    return new Promise(async (resolve, reject) => {
      const annotationRef = db
        .collection('projects')
        .doc(projectId)
        .collection('transcripts')
        .doc(transcriptId)
        .collection('annotations')
        .doc(annotationId);

      annotationRef
        .delete()
        .then(() => {
          console.log('Document successfully deleted!');
          resolve({ ok: true });
        })
        .catch((error) => {
          console.error('Error removing document: ', error);
          reject(error);
        });
    });
  }

  /**
   * Labels
   */

  // Get All Labels
  async getAllLabels(projectId) {
    return new Promise(async (resolve, reject) => {
      const labelsRef = db.collection('projects').doc(projectId).collection('labels');

      labelsRef
        // sorting by created date, to ensure'default' label to be first in list
        .orderBy('created', 'asc')
        .get()
        .then((querySnapshot) => {
          if (querySnapshot.docs.length > 0) {
            const tmpData = querySnapshot.docs.map((doc) => {
              // Add the individual transcript firebase id to the data
              return {
                id: doc.id,
                ...doc.data(),
              };
            });
            // reversing the labels collection so that the default label in db is always at position 0 of the array.
            resolve({ ok: true, status: 'ok', labels: tmpData });
          } else {
            resolve({ ok: true, status: 'ok', labels: [] });
            // console.log('No such document getAllLabels!');
            // reject('No such document getAllLabels!');
          }
        })
        .catch(function (error) {
          console.log('Error getting document getAllLabels:', error);
          reject('No such document! getAllLabels');
        });
    });
  }
  // Get Label - not used
  async getLabel(projectId, labelId) {
    return new Promise(async (resolve, reject) => {
      const labelRef = db.collection('projects').doc(projectId).collection('labels').doc(labelId);

      labelRef
        .get()
        .then((doc) => {
          if (doc.exists) {
            console.log('getLabel Document data:', doc.data());
            const tmpData = doc.data();
            let label = {};
            if (tmpData) {
              label = tmpData;
            }

            resolve({ ok: true, status: 'ok', label });
          } else {
            console.log('No such document! getLabel');
            reject('No such document! getLabel');
          }
        })
        .catch(function (error) {
          console.log('Error getting document getLabel:', error);
          reject('No such document! getLabel');
        });
    });
  }

  // Create Label
  async createLabel(projectId, data) {
    return new Promise((resolve, reject) => {
      const newLabel = {
        projectId,
        ...data,
        created: firebase.firestore.FieldValue.serverTimestamp(),
        updated: firebase.firestore.FieldValue.serverTimestamp(),
      };
      // return
      db.collection('projects')
        .doc(projectId)
        .collection('labels')
        .add(newLabel)
        .then(async (docRef) => {
          const labelId = docRef.id;
          newLabel.id = labelId;
          //TODO: is _id needed, or is it just needed for electron database?
          newLabel._id = labelId;
          // TODO: get labels
          await this.updateLabel(projectId, labelId, newLabel);
          // TODO: Is this call to get all labels needed, is it actually used by the client,
          // or can we just return  { ok: true, status: 'ok' }
          const resp = await this.getAllLabels(projectId);
          resolve(resp);
        })
        .catch(function (error) {
          console.error('Error adding document: ', error);
          reject(error);
        });
    });
  }
  // Update Label
  async updateLabel(projectId, labelId, data) {
    return new Promise((resolve, reject) => {
      const docRef = db.collection('projects').doc(projectId).collection('labels').doc(labelId);

      const tmpData = data;
      tmpData.updated = firebase.firestore.FieldValue.serverTimestamp();
      docRef
        .set(tmpData, { merge: true })
        .then((doc) => {
          // TODO: Is this call to get all labels needed, is it actually used by the client,
          // or can we just return  { ok: true, status: 'ok' }
          const resp = this.getAllLabels(projectId);
          resolve(resp);
        })
        .catch((error) => {
          console.log('Error getting document updateLabel:', error);
          reject('No such document updateLabel!');
        });
    });
  }
  // Delete Label
  async deleteLabel(projectId, labelId) {
    return new Promise(async (resolve, reject) => {
      const projectsRef = db.collection('projects').doc(projectId);
      const paperEditRef = projectsRef.collection('labels').doc(labelId);
      // console.log('transcriptRef', transcriptRef);
      paperEditRef
        .delete()
        .then(() => {
          console.log('Document successfully deleted!');
          // TODO: Is this call to get all labels needed, is it actually used by the client,
          // or can we just return  { ok: true, status: 'ok' }
          const result = this.getAllLabels(projectId);
          resolve(result);
        })
        .catch((error) => {
          console.error('Error removing document: ', error);
          reject(error);
        });
    });
  }
  /**
   * PaperEdits
   */
  async getAllPaperEdits(projectId) {
    // const res = await corsFetch(this.paperEditsUrl(projectId));
    // const json = await res.json();
    // return json.paperedits;
    return new Promise((resolve, reject) => {
      // const transcriptRef = db.collection('transcripts');
      const transcriptRef = db.collection('projects').doc(projectId).collection('paperedits');

      transcriptRef
        .get()
        .then((querySnapshot) => {
          if (querySnapshot.docs.length > 0) {
            const paperedits = querySnapshot.docs.map((doc) => {
              // Add the individual transcript firebase id to the data
              return {
                id: doc.id,
                ...doc.data(),
              };
            });

            resolve(
              // {
              // ok: true,
              paperedits
              // }
            );
          }
        })
        .catch(function (error) {
          console.log('Error getting documents: ', error);
          reject(error);
        });
    });
  }

  async getPaperEdit(projectId, id) {
    return new Promise(async (resolve, reject) => {
      const projectRef = db.collection('projects').doc(projectId);
      const project = await projectRef.get();
      const projectData = project.data();
      console.log('getPaperEdit projectData', projectData);

      const paperEditRef = db.collection('projects').doc(projectId).collection('paperedits').doc(id);

      paperEditRef
        .get()
        .then((doc) => {
          if (doc.exists) {
            console.log('getPaperEdit Document data:', doc.data());
            const tmpData = doc.data();
            console.log('tmpData', tmpData);
            let programmeScript = {
              elements: [],
              title: tmpData.title,
            };

            if (tmpData.elements) {
              programmeScript.elements = tmpData.elements;
            }

            const tmpResult = {
              programmeScript,
            };
            resolve(tmpResult);
          } else {
            console.log('No such document! getPaperEdit');
            reject('No such document! getPaperEdit');
          }
        })
        .catch(function (error) {
          console.log('Error getting document getPaperEdit: ', error);
          reject('No such document! getPaperEdit');
        });
    });
  }

  async createPaperEdit(projectId, data) {
    console.log('createPaperEdit', data);
    // const res = await corsFetch(this.paperEditsUrl(projectId), 'POST', data, 'json');
    // return await res.json();
    const { title, description } = data;
    return new Promise((resolve, reject) => {
      // return
      db.collection('projects')
        .doc(projectId)
        .collection('paperedits')
        .add({
          // projectId,
          title,
          description,
          created: firebase.firestore.FieldValue.serverTimestamp(),
          updated: firebase.firestore.FieldValue.serverTimestamp(),
          // type,
          // clipName,
        })
        .then((docRef) => {
          const response = {
            status: 'ok',
            paperedit: {
              title,
              description,
              id: docRef.id,
            },
          };

          resolve(response);
        })
        .catch(function (error) {
          console.error('Error adding document: ', error);
          reject(error);
        });
    });
  }

  async updatePaperEdit(projectId, id, data) {
    return new Promise((resolve, reject) => {
      const docRef = db.collection('projects').doc(projectId).collection('paperedits').doc(id);

      const tmpData = data;
      tmpData.updated = firebase.firestore.FieldValue.serverTimestamp();
      docRef
        .set(tmpData, { merge: true })
        .then((doc) => {
          resolve({ status: 'ok', paperedit: data });
        })
        .catch((error) => {
          console.log('Error getting document:', error);
          reject('No such document! updatePaperEdit');
        });
    });
  }

  async deletePaperEdit(projectId, id) {
    return new Promise(async (resolve, reject) => {
      const projectsRef = db.collection('projects').doc(projectId);
      const paperEditRef = projectsRef.collection('paperedits').doc(id);
      // console.log('transcriptRef', transcriptRef);
      paperEditRef
        .delete()
        .then(() => {
          console.log('Document successfully deleted!');
          resolve({ ok: true });
        })
        .catch((error) => {
          console.error('Error removing document: ', error);
          reject(error);
        });
    });
  }

  /**
   * Helper SDK function to avoid making multiple calls client side when in Annotated Transcript view
   * Transcript + Annotations for that transcript + Labels for the project
   */
  // async getTranscriptLabelsAnnotations(projectId, transcriptId) {
  //   // GET Transcripts
  //   const transcriptResult = await this.getTranscript(projectId, transcriptId);
  //   // GET Labels for Project <-- or separate request in label component
  //   const labelsResults = await this.getAllLabels(projectId, transcriptId);
  //   // GET Annotation for Transcript
  //   const annotationsResult = await this.getAllAnnotations(projectId, transcriptId);

  //   // Combine results
  //   const results = {
  //     transcriptId: transcriptId,
  //     projectId: projectId,
  //     projectTitle: transcriptResult.projectTitle,
  //     transcriptTitle: transcriptResult.transcriptTitle,
  //     url: transcriptResult.url,
  //     labels: labelsResults.labels,
  //     transcript: transcriptResult.transcript,
  //     annotations: annotationsResult.annotations,
  //   };

  //   return results;
  // }

  // Helper function to get program script & associated transcript
  // https://flaviocopes.com/javascript-async-await-array-map/
  async getProgrammeScriptAndTranscripts(projectId, papereditId) {
    console.log('getProgrammeScriptAndTranscripts', projectId, 'papereditId', papereditId);
    // get transcripts list, this contain id, title, description only
    const transcriptsResult = await this.getTranscripts(projectId);
    console.log('transcriptsResult', transcriptsResult);
    // use that list of ids to loop through and get json payload for each individual transcript
    // as separate request
    // TODO: also add annotations for each Transcripts
    const transcriptsJson = await Promise.all(
      transcriptsResult.transcripts.map((transcript) => {
        // const annotations = this.getAllAnnotations(projectId, transcript.id);
        // console.log('transcript.id', transcript.id);
        const transcriptTmp = this.getTranscript(projectId, transcript.id);
        // transcriptTmp.annotations = annotations;
        // transcriptTmp.id = transcript.id;
        // console.log('transcriptTmp', transcriptTmp);
        return transcriptTmp;
      })
    );

    console.log('transcriptsJson', transcriptsJson);

    const annotationsJson = await Promise.all(
      transcriptsResult.transcripts.map((transcript) => {
        const annotations = this.getAllAnnotations(projectId, transcript.id);

        return annotations;
      })
    );

    // add annotations to transcript
    transcriptsJson.forEach((tr) => {
      // get annotations for transcript
      const currentAnnotationsSet = annotationsJson.find((a) => {
        return a.transcriptId === tr.id;
      });
      // if there are annotations for this transcript add them to it
      if (currentAnnotationsSet) {
        tr.annotations = currentAnnotationsSet.annotations;

        return;
      } else {
        tr.annotations = [];
      }
    });

    // getting program script for paperEdit
    const paperEditResult = await this.getPaperEdit(projectId, papereditId);
    // getting project info - eg to get tile and description
    const projectResult = await this.getProject(projectId);
    // Get labels
    const labelsResults = await this.getAllLabels(projectId);
    console.log('labelsResults', labelsResults);
    // package results
    const results = {
      programmeScript: paperEditResult.programmeScript,
      project: projectResult.project,
      // each transcript contains its annotations
      transcripts: transcriptsJson,
      labels: labelsResults.labels,
    };

    return results;
  }

  // TODO: may or may not support this for web app?
  async exportAudioVideo({ sequence, fileName, waveForm, waveFormMode, waveFormColor, projectId }) {
    console.log('exportVideo', sequence, fileName);
    return new Promise(async (resolve, reject) => {
      const ffmpegRemix = firebase.functions().httpsCallable('ffmpegRemix');
      await ffmpegRemix({
        input: sequence,
        waveForm,
        waveFormMode,
        waveFormColor,
        output: `${fileName}`,
        projectId,
      })
        .then(async ({ data }) => {
          // Read result of the Cloud Function. it's wrapped in data attribute.
          alert('finished exporting');
          console.log('data', data);
          const pathReferenceRemix = storage.ref(data);
          // https://firebase.google.com/docs/storage/web/download-files#full_example
          const urlOfRemix = await pathReferenceRemix.getDownloadURL();
          console.log('res url', urlOfRemix);
          downloadURI(urlOfRemix, fileName);
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  // TODO: may or may not support this for web app?
  // async exportAudio({ sequence, fileName, waveForm, waveFormMode, waveFormColor, projectId }) {
  //   const ffmpegRemixAudio = firebase.functions().httpsCallable('ffmpegRemixVideo');
  //   return new Promise((resolve, reject) => {
  //     ffmpegRemixAudio({
  //       input: sequence,
  //       waveForm,
  //       waveFormMode,
  //       waveFormColor,
  //       output: `${fileName}`,
  //       projectId,
  //     })
  //       .then(ffmpegRemixData => {
  //         // Read result of the Cloud Function.
  //         // var sanitizedMessage = result.data.text;
  //         resolve(ffmpegRemixData);
  //       })
  //       .catch(error => {
  //         reject(error);
  //       });
  //   });
  // }
}

function downloadURI(uri, name) {
  const link = document.createElement('a');
  // link.target = '_blank';
  // link.rel = 'noopener noreferrer';
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  // delete link;
}

export default ApiWrapper;
