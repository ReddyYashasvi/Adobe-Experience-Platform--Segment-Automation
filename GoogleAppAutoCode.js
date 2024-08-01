const CLIENT_ID = PropertiesService.getScriptProperties().getProperty('x-api-key');
const CLIENT_SECRET = 'p8e-aYZGpvFRZVUnLIvcf5a-BPTgkQFjdU69';
const ORG_ID = PropertiesService.getScriptProperties().getProperty('x-gw-ims-org-id');
const SANDBOX_NAME = PropertiesService.getScriptProperties().getProperty('x-sandbox-name');
const TOKEN_URL = 'https://ims-na1.adobelogin.com/ims/token/v3';
const BASE_API_URL = 'https://platform.adobe.io/data/core/ups/segment/definitions';
const SCOPES = 'openid,AdobeID,read_organizations,additional_info.projectedProductContext,session';

function getAccessToken() {
  const payload = {
    'client_id': CLIENT_ID,
    'client_secret': CLIENT_SECRET,
    'grant_type': 'client_credentials',
    'scope': SCOPES,
  };

  const options = {
    'method': 'post',
    'payload': payload,
    'headers': {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    'muteHttpExceptions': true,
  };

  try {
    const response = UrlFetchApp.fetch(TOKEN_URL, options);
    const responseJson = JSON.parse(response.getContentText());
    Logger.log('Access Token Response: ' + response.getContentText());
    return responseJson.access_token;
  } catch (error) {
    Logger.log('Error in getAccessToken: ' + error.message);
    throw error;
  }
}

function fetchData(page = 0) {
  const accessToken = getAccessToken();
  const url = `${BASE_API_URL}?limit=100&page=${page}&orderBy=desc:created`;
  Logger.log(`Fetching data from URL: ${url}`);

  const options = {
    'method': 'get',
    'headers': {
      'Authorization': `Bearer ${accessToken}`,
      'x-api-key': CLIENT_ID,
      'x-gw-ims-org-id': ORG_ID,
      'x-sandbox-name': SANDBOX_NAME,
      'Accept': 'application/json',
    },
    'muteHttpExceptions': true,
  };

  try {
    const response = UrlFetchApp.fetch(url, options);
    const responseJson = JSON.parse(response.getContentText());
    Logger.log('Fetch Data Response: ' + response.getContentText());
    if (response.getResponseCode() !== 200) {
      throw new Error(`Failed to fetch data: ${response.getContentText()}`);
    }
    return responseJson;
  } catch (error) {
    Logger.log('Fetch Data Error: ' + error.message);
    throw error;
  }
}

function updateSheet() {
  try {
    Logger.log("Starting updateSheet function");
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    sheet.clear();

    // Define the columns to keep based on the actual structure from Jupyter Notebook
    const columnsToKeep = [
      "id", "ttlInDays", "sandbox", "name", "description", "evaluationInfo", "creationTime",
      "updateEpoch", "updateTime", "createEpoch", "_etag", "dependents", "definedOn",
      "dependencies", "createdBy", "lastModifiedBy", "lifecycle", "namespace", "audienceId",
      "saveSegmentMembership", "origin", "metrics", "tags", "lifecycleState", "originName"
    ];

    // Write headers
    sheet.appendRow(columnsToKeep);
    Logger.log("Headers written to the sheet");

    let page = 0;
    let hasMoreData = true;
    let totalRows = 0;

    while (hasMoreData) {
      const data = fetchData(page);
      Logger.log("Data fetched successfully");

      if (data.segments && data.segments.length > 0) {
        totalRows += data.segments.length;
        Logger.log(`Fetched ${data.segments.length} segments, Total rows so far: ${totalRows}`);

        // Write rows
        const segments = data.segments.map(segment => {
          return columnsToKeep.map(col => segment[col] || ''); // Use empty string for missing values
        });

        segments.forEach(row => {
          sheet.appendRow(row);
        });

        page += 1; // Move to the next page
      } else {
        hasMoreData = false; // No more data to fetch
        Logger.log("No more data to fetch");
      }
    }

    Logger.log("Sheet updated successfully");
  } catch (error) {
    Logger.log(`Error in updateSheet: ${error.message}`);
  }
}
