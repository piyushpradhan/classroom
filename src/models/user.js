class User { 
  constructor(displayName, email, photoURL, uid ) {
    this.displayName = displayName; 
    this.email = email; 
    this.photoURL = photoURL;
    this.uid = uid; 
  }

  getUserId() {
    return this.uid; 
  }

  getDisplayName() {
    return this.displayName; 
  }

  getEmail() {
    return this.email; 
  }

  getPhotoURL() {
    return this.photoURL; 
  }
}
