import axios from "axios";

// Define the function to upload the image
export const UPLOAD_IPFS_IMAGE = async (file: File): Promise<string | undefined> => {
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
  
      try {
        // Sending the file to Pinata's API for pinning
        const response = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: "04375c5c264a939215b8",  // Replace with your actual Pinata API Key
            pinata_secret_api_key: "c5eb333a034891385c09dd89d2756741bf89d1cb8b1d3fa698ce63809d14d7a6", // Replace with your actual Pinata Secret Key
            "Content-Type": "multipart/form-data",
          },
        });
        
        const ImgHash = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
        console.log("Image uploaded to Pinata:", ImgHash);  // Log the URL for debugging
        return ImgHash;
      } catch (error) {
        console.error('Error uploading image to IPFS:', error);
        return undefined;  // Return undefined if there was an error
      }
    }
    return undefined;  // Return undefined if no file was provided
  };
  