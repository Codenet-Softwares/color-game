import { db } from "../firebase-db.js";

// Helper function to delete a lottery by ID
export async function deleteLotteryFromFirebase(marketId) {
  try {
    const docRef = db.collection("color-game-db").doc(marketId);
    const docSnapshot = await docRef.get();

    if (!docSnapshot.exists) {
      console.log(`No document found with ID: ${marketId}`);
      return;
    }

    await docRef.delete();
    console.log(`Deleted Firebase Color document with ID: ${marketId}`);
  } catch (error) {
    console.error(`Error deleting Color document from Firebase: ${error}`);
  }
}