import supabase, { supabaseUrl } from "./supabase";

export async function getUrls(user_id) {
  let { data, error } = await supabase
    .from("urls")
    .select("*")
    .eq("user_id", user_id);

  if (error) {
    console.error(error);
    throw new Error("Unable to load URLs");
  }

  return data;
}

export async function getUrl({ id, user_id }) {
  const { data, error } = await supabase
    .from("urls")
    .select("*")
    .eq("id", id)
    .eq("user_id", user_id)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Short Url not found");
  }

  return data;
}

export async function getLongUrl(id) {
  let { data: shortLinkData, error: shortLinkError } = await supabase
    .from("urls")
    .select("id, original_url")
    .or(`short_url.eq.${id},custom_url.eq.${id}`)
    .single();

  if (shortLinkError && shortLinkError.code !== "PGRST116") {
    console.error("Error fetching short link:", shortLinkError);
    return;
  }
  
  return shortLinkData;
}

/* ORIGINAL */
// export async function createUrl({title, longUrl, customUrl, user_id}, qrcode) {
//   const short_url = Math.random().toString(36).substr(2, 6);
//   const fileName = `qr-${short_url}`;

//   const {error: storageError} = await supabase.storage
//     .from("qrs")
//     .upload(fileName, qrcode);

//   if (storageError) throw new Error(storageError.message);

//   const qr = `${supabaseUrl}/storage/v1/object/public/qrs/${fileName}`;

//   const {data, error} = await supabase
//     .from("urls")
//     .insert([
//       {
//         title,
//         user_id,
//         original_url: longUrl,
//         custom_url: customUrl || null,
//         short_url,
//         qr,
//       },
//     ])
//     .select();

//   if (error) {
//     console.error(error);
//     throw new Error("Error creating short URL");
//   }

//   return data;
// }

/* MINE */
export async function createUrl(
  { title, longUrl, customUrl, user_id },
  qrcode
) {
  // console.log("title:", title);
  // console.log("longurl:", longUrl);
  // console.log("customurl:", customUrl);
  // console.log("userid:", user_id);

  // Fetch the short URL from the provided service
  const response = await fetch(
    "http://lb-cli-serv-url-shrtnr-1049647747.ap-south-1.elb.amazonaws.com/create",
    {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ originalUrl: longUrl }),
    }
  );

  if (response.status == 429) {
    throw new Error("Too Many Requests. Please try again later.");
  } else if (response.status === 400) {
    throw new Error("Invalid URL");
  }

  console.log("response:", response);

// Fetch the response as a plain text string
const responseData = await response.json();  
console.log("Response Data: ", responseData);  // This should log the full URL

// Ensure the response is trimmed of any extra whitespace
const responseData_ = JSON.stringify(responseData)
const trimmedResponse = responseData_.trim();

// Extract the short ID from the URL
const short_url_ = trimmedResponse.split('/').pop();  // Extract the short part of the URL (aMaa1nl)
console.log("Short ID: ", short_url_);

let short_url = "";

for(let i=0; i<short_url_.length; i++){
   if(short_url_[i] != '"') short_url += short_url_[i];
}


  // Generate QR code file name using the short URL
  const fileName = `qr-${short_url}`;

  // Upload the QR code to Supabase storage
  const { error: storageError } = await supabase.storage
    .from("qrs")
    .upload(fileName, qrcode);

  if (storageError) throw new Error(storageError.message);

  // Construct the QR code URL
  const qr = `${supabaseUrl}/storage/v1/object/public/qrs/${fileName}`;

  // Insert URL details into the database
  const { data, error } = await supabase
    .from("urls")
    .insert([
      {
        title,
        user_id,
        original_url: longUrl,
        custom_url: customUrl || null,
        short_url, // Use the short URL from the service response
        qr,
      },
    ])
    .select();

  if (error) {
    console.error(error);
    throw new Error("Error creating short URL");
  }

  return data;
}

export async function deleteUrl(id) {
  const { data, error } = await supabase.from("urls").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Unable to delete Url");
  }

  return data;
}
