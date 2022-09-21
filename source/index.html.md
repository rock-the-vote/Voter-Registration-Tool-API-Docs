---

title: Rocky RESTful API Version 4.0 (Unofficial)

toc_footers:
  - Sign Up for a Developer Key https://www.rockthevote.org/programs-and-partner-resources/tech-for-civic-engagement/online-voter-registration-platform/ 

search: true
---

# Overview

Rocky is web application that provides a web user interface that U.S. citizens can use for assistance in preparing a voter registration application document that is complete and correct for all Federal and state­ specific requirements, and therefore should be accepted in most cases by the election officials to whom the user submits the completed, printed, signed form.

This specification defines an application programming interface that provides exactly the same functions as the Rocky web UI, but intended for a complementary purpose: use by other web applications that have or collect personal info via their own web UI, and which rely on the Rocky back­end for data validation, error reporting (particularly for state­ specific conditions), PDF generation, and data storage. Via this API, Rocky provides a web service to service clients (web applications that use this API to interact with Rocky) that are software operated by Rocky "partner organizations".

Partner organizations also have access to aggregated data and reporting. These are provided by the Rocky Web UI in two ways partner organization staff can use to obtain statistics and summary information: a CSV file download provides aggregated registration data for all the registrations done via that partner; and a summary web page provides statistics about this partner­specific aggregated data set. This API provides analogous bulk data extraction, with the "partner_registrations" interface that returns the same data as is provided in the web UI CSV file download.

The primary interface is this API is the "registrations" interface, in which callers provide all the personal data needed to create a person’s voter registration application form. Rocky checks the validity of each field, including state­ specific validation rules. If there are errors, Rocky returns to the caller a set of error reporting on individual fields of personal data. If there are no errors, Rocky returns the URL of a PDF file that contains the validated information, properly formatted as a voter registration request form.

This API also includes an optional interface "state_requirements," used to pre­check the user data based on location and date of birth. One intended use of the pre­check function is for cases where service clients that already know the user’s location, and perhaps also DOB. In such cases, the service client can find out from Rocky whether a user is ineligible, and if so, not even begin the web UI dialogues with the user to obtain personal information. Location ineligibility is the result of states that do not allow voter registration by mail, or do not accept Rocky­generated forms for some other reason. DOB is used to determine age ineligibility in the user’s state.

When the user is not ineligible based on location or DOB, "state_requirements" returns several kinds of state­ specific information that the caller could use as part its web UI with the user ­­ for example, the list of political parties that user can select for affiliation, or an indication that certain fields are optional for the state, or not collected by the state.

Finally, the API includes the "partner_registrations" interface to obtain records of past registration transactions. Like the similar UI in the Rocky Partner Portal, access requires authentication, and the records returned are only those pertinent to the authenticated entity.

# Release Notes

## V4

The registration submission endpoint (/api/v4/registrations and /api/v4/gregistrations) will now return a validation error if the email address submitted is in our block list.

### Removed 

* `GET /api/v4/registrations`  
* `GET /api/v4/gregistrations`

We will also depreacte old versions (v1, v2, v3) of these APIs shortly and return only an error message.

### Added

* `POST /api/v4/registrant_reports` - create report
* `GET /api/v4/registrant_reports/<ID>` - check the status of a particular report and get the download URL
* `GET /api/v4/registrant_reports/<ID>/download` - download the contents of a registrant report in CSV format


## V3

Added these interfaces:

* `GET /api/v3/registrations/pdf_ready`
* `POST /api/v3/registrations/stop_reminders`
* `POST /api/v3/registrations/bulk`

In addition: 

* Added parameter for registration to indicate async PDF generation or response blocking PDF generation.
* Added parameter for custom stop_reminders url. Added UID to the response.
* Modified format from `/api/v3/partners/partner.json` to `/api/v3/partners/[partner_id].json`
* Added `application/registration/partner` CSS urls, `finish_iframe_url`, `external_tracking_snippet`, `registration_instructions_url` to `/api/v3/partners/[partner_id].json` response.
* Added new fields to match column names for ActiveResource expectations and general standardization.

Modified request for:

* `GET /api/v3/partners/[partner_id].json`

to allow for all survey question languages.

## V2.2

Added these interfaces:

* `GET /api/v2/partnerpublicprofiles/partner.json`
* `GET /api/v2/gregistrationstates.json`
* `POST /api/v2/gregistration.json`
* `GET /api/v2/gregistrations.json`

Since this addition did not modify the existing API, did not rev from v2 to v3.

# Status Codes

All successful requests have response status code 200.

All requests with errors stemming from invalid or missing inputs have status code 400.

# Response Bodies

All response bodies are JSON dictionaries, with the key/value pairs described

# Interface Definitions

All requests and responses are JSON format. All fields are required unless otherwise specified as optional. All string fields have no length or format restrictions, unless specifically stated. Some field values have specific formats; others have parenthesized notations on field values.

## registrations

Creates a new registrant record using the input parameter data; and also triggers the side effects of a new record, e.g. sending confirmation email.

<h3 id="registration-fields">Fields</h3>

Most fields are personal information. A few fields merit additional description:

Field | Description
----- | -----------
partner_id | Uniquely identifies a partner organization that uses Rocky as a service for the organization’s members or community. Each transaction is logged by partner_id and every registrant record is tagged by partner_id.
source_tracking_id | Used to identify the source of a request. For example, in the Web UI, it is typically used as query parameter embedded in a URL in email messages, and identifies the request as part of a particular email campaign. The string value is un­interpreted, however, and may be used for any similar purpose
partner_tracking_id |  Similar to `source_tracking_id`, but intended for use for partner­ specific purposes, such as implementing a leader­board, that may require an a tag in addition to the source_tracking_id.
id_number | Typically a state driver’s license number state ID card number, or social security number; length and format vary by state, as does the explanation of what forms of ID are acceptable. However, id_number is not optional. (Note: it is true that some states’ localities will accept NVRA forms without an ID number, for the special case of people with neither state ID or an SSN. However, since we cannot record precisely how each state handles this special case, we require some ID number, to avoid creating registration requests that may be rejected.)
email_address | Required by default, even though it is optional for the paper form; however, we need it to contact the user to send them a link to the PDF we generate for them.
opt_in_email |  Determined by the caller, and simply recorded in the registration record created by the call; the caller can determine whether to always obtain the info from the user, or have a default in the case of no user input. Regardless, the opt_in_email field is required to record true or false for opt­ion, regardless of how the caller determined the user’s preference. This field is used to record a user preference for email from RockTheVote.
opt_in_sms | Required in exactly the same way as `opt_in_email`
opt_in_volunteer | Required in exactly the same way as `opt_in_email`
partner_opt_in_email, partner_opt_in_sms, partner_opt_in_volunteer | Used in an analogous way to record user preference for communication with the partner organization.
party |  Optional because it is not required on the form; however, the allowable values are state specific.
callback |  Optional parameter that, if present and not empty, changes the return value from JSON format to jsonp; that is, the JSON return value would be a string J, and if the callback parameter’s value is F, then the return value will be F(J);
custom_stop_reminders_url | Optional URL string that will be used in a link in reminder emails to registrants to cancel any further reminder emails. If the provided URL includes `<UID>`, that string will be replaced by the registrant’s UID. If left blank, the default core system stop_reminders URL will be used.
async | Specifies whether or not the request should return a response immediately (async=false) or wait for a PDF to be generated (async=true)

Other Notes

* Some fields are required in some states, optional in others, and not recorded in others; similarly some fields have permitted values that vary by state. State­ specific information is provided by other interfaces in this API.
* `pdfurl` is an out parameter that is the URL of a PDF file containing the voter registration application form with the personal information provided in the request.
  * The URL itself is a large number, large enough to make it very difficult for adversaries to guess URLs, for example https://register.rockthevote.org/pdf/456136972787234.pdf
  * One intended use is that the caller embed the URL in a link in dynamically generated HTML that is presented to the user.
  * The URL is returned regardless of whether the PDF is ready for download.

> Example POST request payload (minimum required fields)

```json
{
  "registration": {
    "lang": "en",
    "partner_id": "123456789",
    "send_confirmation_reminder_emails": true,
    "created_at": "01102016 11:22:33",
    "updated_at": "01102016 12:23:56",
    "date_of_birth": "01-01-1990",
    "id_number": "1234",
    "email_address": "me@me.com",
    "first_registration": true,
    "home_zip_code": "01234",
    "us_citizen": true,
    "has_state_license": true,
    "is_eighteen_or_older": true,
    "name_title": "Mrs.",
    "last_name": "Smith",
    "home_address": "123 Main St",
    "home_city": "Big Town",
    "home_state_id": "CA",
    "has_mailing_address": false,
    "race": "White (not Hispanic)",
    "change_of_name": false,
    "change_of_address": false,
    "opt_in_email": true,
    "opt_in_sms": true,
    "opt_in_volunteer": false,
    "partner_opt_in_email": true,
    "partner_opt_in_sms": false,
    "partner_opt_in_volunteer": true"
  }
}
```

Field | Type | Notes
----- | ---- | -----
lang | locale­-compatible string | Required. Options: (en/es, etc)
partner_id | string | Required. Series of digits, no specific length
<small>send_confirmation_reminder_emails</small> | boolean | Required
collect_email_address | string | Optional. ‘no’ for false
source_tracking_id | string | Optional |
partner_tracking_id | string | Optional |
short_form | boolean | Optional. Default false
state_ovr_data | string | Optional. Hash, only used for stats and in cases where registrant went through finish­ with­ state steps but ended up finishing with rock the vote)
created_at | datetime | Required. ‘mm­dd­yyyy hh:mm:ss’ (for statistics)
updated_at | datetime | Required.  ‘mm­dd­yyyy hh:mm:ss’ (for statistics)
date_of_birth | date | Required. ‘mm-dd-yyyy’
id_number | string | Required. Series of alnum, length and format state specific
email_address | string | Required. RFC syntax
first_registration | boolean | Required |
home_zip_code | string | Required. ‘zzzzz’ ( 5 digit)
us_citizen | boolean | Required
has_state_license | boolean | Required
is_eighteen_or_older | boolean | Required
name_title | string | Required. Must be one of "Mr.", "Mrs.", "Miss", "Ms.", "Sr.", "Sra.", "Srta."
first_name | string | Optional |
middle_name | string | Optional |
last_name | string | Required |
name_suffix | string | Optional. Must be one of "Jr.", "Sr.", "II", "III", "IV"
home_address | string | Required |
home_unit | string | Optional
home_city | string | Required |
home_state_id | string(2) | Required |
has_mailing_address | boolean | Required |
mailing_address | string | Req if `has_mailing_address`
mailing_unit | string | Optional
mailing_city | string | Req if `has_mailing_address` |
mailing_state_id | string(2) | Req if `has_mailing_address` |
mailing_zip_code | string  | Req if `has_mailing_address`
race | string | Required/optional is state­ specific| Value must be one of "American Indian / Alaskan Native", "Asian / Pacific Islander", "Black (not Hispanic)", "Hispanic", "Multi­racial", "White (not Hispanic)", "Other", "Decline to State", "Indio Americano / Nativo de Alaska", "Asiatico / Islas del Pacifico", "Negra (no Hispano)", "Hispano", "Blanca (no Hispano)", "Otra", "Declino comentar"
party | string | Optional. No validation because allowable choices are state specific
phone | string | Optional
phone_type | string | Required if a phone number is provided. Must be one of "Mobile", "Home", "Work", "Other", "Movil", "Casa", "Trabajo", "Otro"
change_of_name | boolean | Required
prev_name_title | string | Optional |
prev_first_name | string | Optional |
prev_middle_name | string | Optional |
prev_last_name | string | Req if `change_of_name` |
prev_name_suffix | string | Optional |
change_of_address | boolean | Required
prev_address | string | Req if `change_of_address` |
prev_unit | string | Optional |
prev_city | string | Req if `change_of_address`
prev_state_id | string(2) | Req if `change_of_address`
prev_zip_code | string | Req if `change_of_address`
opt_in_email | boolean | Required
opt_in_sms | boolean | Required
opt_in_volunteer | boolean | Required
partner_opt_in_email | boolean | Required
partner_opt_in_sms | boolean | Required
partner_opt_in_volunteer | boolean | Required
survey_question_1 | string | Req if `survey_answer_1` is not blank
survey_answer_1 | string | Optional
survey_question_2 | string | Req if `survey_answer_2` is not blank
survey_answer_2 | string | Optional
callback | string | Optional |
custom_stop_reminders_url | string | Optional. URL format
async | boolean | Optional. Default is "true"

### HTTP Request

`POST /api/v4/registrations.json`

Post JSON dictionary of fields nested under `registration`

### Success Response 

Key | Value Type | Note
--- | ---------- | -----
pdfurl | string | URL (for the generated PDF)
uid | string | UID string

<h3 id="registrations-errors">Errors</h3>

#### Validation Error

Key | Value Type | Note
--- | ---------- | -----
field_name | string | Field where error occurred
message | string | Determined by Rocky, for display by caller, in specified lang


#### Syntax Error

Key | Value Type | Note
--- | ---------- | -----
field_name | string | Name of field that is not defined for this request
message | string | Value: "Invalid parameter type"


#### Unsupported language

Key | Value Type
--- | ----------
message | string


#### Survey Question Error

Key | Value Type | Note
--- | ---------- | ------
message | string | Format: 'Question N required when Answer N provided'

## bulk_registrations

Creates 1­ or multiple incomplete registrant records. Used for creating data in the core Rocky system for statistics, but does not cause emails to be sent or PDFs to be created. Validations are not performed.

<h3 id="bulk-registration-fields">Fields</h3>

[Registration interface definition fields](#registration-fields), plus these fields (all required):

Field | Type | Notes
----- | ---- | -----
status | string | Indicates a step number that the user stopped at
ineligible_non_participating_state | boolean | Whether the registrant is ineligible due to the state not participating
ineligible_age | boolean | Whether the registrant is ineligible due to being too young
ineligible_non_citizen | boolean | Whether the registrant is ineligible due to not being a US citizen
under_18_ok | boolean | Whether the registrant decided to proceed despite being under 18
remind_when_18 | boolean | Whether the registrant requested a reminder when 18
age | integer | Age of registrant
javascript_disabled | boolean | Whether the user had javascript disabled
using_state_online_registration | boolean | Whether the user selected to use the state online reg system
finish_with_state | boolean  | Whether the user is in a "finish_with_state" flow

### HTTP Request

`POST /api/v4/registrations/bulk`

Body is JSON list of `registration` dictionaries combining [bulk](#bulk-registration-fields) and [normal](#registration-fields) registration fields

```json
{
  "registrations": [
    {
      "status": "1",
      "ineligible_non_participating_state": false,
      "ineligible_age": false,
      "ineligible_non_citizen": false,
      "under_18_ok": false,
      "remind_when_18": false,
      "age": 20,
      "javascript_disabled": false,
      "using_state_online_registration": false,
      "finish_with_state": false,
      "lang": "en",
      "partner_id": "123456789",
      "send_confirmation_reminder_emails": true,
      "created_at": "01102016 11:22:33",
      "updated_at": "01102016 12:23:56",
      "date_of_birth": "01-01-1990",
      "id_number": "1234",
      "email_address": "me@me.com",
      "first_registration": true,
      "home_zip_code": "01234",
      "us_citizen": true,
      "has_state_license": true,
      "is_eighteen_or_older": true,
      "name_title": "Mrs.",
      "last_name": "Smith",
      "home_address": "123 Main St",
      "home_city": "Big Town",
      "home_state_id": "CA",
      "has_mailing_address": false,
      "race": "White (not Hispanic)",
      "change_of_name": false,
      "change_of_address": false,
      "opt_in_email": true,
      "opt_in_sms": true,
      "opt_in_volunteer": false,
      "partner_opt_in_email": true,
      "partner_opt_in_sms": false,
      "partner_opt_in_volunteer": true
    }
  ]
}
```

### Success

Field | Type | Notes
----- | ---- | -----
abandoned_registrations | integer | Number of records written


### Error Response

If any registrations can't be saved, status code 400 is returned, with a JSON list of responses for each record that is either an empty hash (`{}`) if there are no errors for that user, or a dictionary with `type`, `field_name` and `message` if there is an error

Field | Type | Notes
----- | ---- | -----
type | string | ValidationError, SyntaxError, UnsupportedLanguageError
field_name | string | Field where error occurred
message | string | Determined by Rocky, for display by caller, in specified lang


## gregistrations

Creates a new registrant record using the input parameter data, for the use case where the user was eligible to finish their registration on a government operated state­ specific web site, chose to be re­directed there, and did not return ­­ presumably because they finished registration on the state’s site.

 Differs from registrations only in the following ways:

 * Only the following parameters are required
   * lang
   * gpartner_id
   * send_confirmation_reminder_emails
   * date_of_birth
   * email_address
   * home_zip_code
   * us_citizen
   * name_title
   * last_name
 * If `send_confirmation_reminder_emails` is true, then the emails sent are the the emails that are pertinent to this use case, rather than the standard use case of completing a registration using the Rocky UI
 * The PDF is not generated, and therefore the `async` parameter has no effect
 * Success has no output parameters
 * There is an additional error return code

 ### HTTP Request

 ```json
 {
   "registration": {
     "lang": "en",
     "gpartner_id": "123456789",
     "send_confirmation_reminder_emails": true,
     "date_of_birth": "01-01-1990",
     "email_address": "me@me.com",
     "home_zip_code": "01234",
     "us_citizen": true,
     "name_title": "Mrs.",
     "last_name": "Smith"
   }
 }
 ```

 `POST /api/v4/gregistrations.json`

 Post a JSON object with key `registration` and value of a registration object

 ### Success

 No body

 ### Errors

 #### Unsupported state

 Key | Value Type
 --- | ---------
 message | string

 See [registrations interface definition errors](#registrations-errors) for other return data definitions.

 ## bulk_gregistrations

 Same as gregistrations but expects an array of registrant records and returns the number of records created.

 ### Fields

 [Registration interface definition fields](#registration-fields), plus these fields (all required):

 Field | Type | Notes
 ----- | ---- | -----
 status | string | Indicates a step number that the user stopped at
 created_at | string | UTC datetime format
 updated_at | string | UTC datetime format

 ### HTTP Request

 `POST /api/v4/bulk_gregistrations.json`

 Body is JSON dictionary with a single key, `bulk_gregistrations`, and value as a list of bulk registration dictionaries, as described above.

 ### Success Response

 Body is a dictionary with key `bulk_gregistrations`, and the value is an integer with the number of records written, which should be the number of registrations posted.

 > Success Response

 ```json
 {
   "bulk_gregistrations": "integer (number of records written)"
 }
 ```

 ### Error

 If any registrations have an error, a status code 400 is returned, with a JSON list of responses for each record that is either an empty hash ({}) if there are no errors for that user, or a dictionary with `type`, `field_name` and `message` if there is an error

 > Example object for a user with an error

 ```json
 {
   "type": "string (ValidationError, SyntaxError, UnsupportedLanguageError)",
   "field_name": "string (field where error occurred)",
   "message": "string (determined by Rocky, for display by caller, in specified lang)"
 }
 ```

 ## gregistrationstates

 Returns a list of state for which Rocky current supports per­-state integration with states. There are no input parameters. State return data is the 2 letter code for the state, and the URL to use to send registrant data to the state’s web site.

 ### HTTP Request

 `GET /api/v4/gregistrationstates.json`

 ### Response

 Returns status code 200, with both of a dictionary with one key, `states`, which is a list of dictionaries with two keys: `name` which is the 2 letter state code, and `url` which is a string URL.

 > Example response (truncated)

 ```json
 {
   "states": [
     {
       "name": "AZ",
       "url": "https://servicearizona.com/webapp/evoter/selectLanguage"
     },
     {
       "name": "CA",
       "url": "https://covrtest.sos.ca.gov?language=LANGUAGE&t=p&CovrAgencyKey=AGENCY_KEY&PostingAgencyRecordId=TOKEN"
     }
   ]
 }
 ```

 ## state_requirements

Checks state eligibility and provides state­ specific fields information

Most input fields are personal information; most output fields are indicated as state specific. A few fields merit additional description:

* For input, one of `home_state_id` and `home_zip_code` is required. If both are provided, they must match. Really only one is needed.
* Fields named `<foo>_msg` contain a string with state­ specific information that explains the state­ specific situation of `<foo>`, such as what the requirements are for reporting race, or stating party affiliation, or why the state does not allow party affiliation, or what the state’s rules are about ID numbers for voter registration, or for minimum age for filing a voter registration application.
* Fields named `sos_<foo>` refer to the contract information for the office of Secretary of State for the state specified in the `home_state_id` input field
* Invalid state error is for a `home_state_id` input field value that is not a state, e.g. AJ
* Non-participating state error is for a correct state id, but for a state that does not participate in mail­in NVRA­ form registration; the explanatory msg is state­ specific
* To validate the age, make sure the person is 18+ yo and return localized error message if she’s not
* `no_party_msg` is the name of the last option for party affiliation; in some states it is "none" while in others it is "decline to state" and over time any state can change its preferences
* `requires_party_msg` explains the state’s rules for whether an application must or may include a party affiliation selection
* `callback` is an optional string parameter, exactly as described above

### HTTP Request

`GET /api/v4/state_requirements.json`

Parameter | Type | Notes
--------- | ---- | -----
lang | string | Required. Locale­ compatible string (en/es, etc)
home_state_id | string | Required. 2-character state abbreviation
home_zip_code | string | Required. ‘zzzzz’ 5 digit zip code
date_of_birth | string | Optional. ‘mm-dd-yyyy’
callback | string | Optional.

### Success response

Key | Value Type
--- | ----
requires_race | boolean
requires_race_msg | string
requires_party | boolean
requires_party_msg | string
no_party | boolean
no_party_msg | string
party_list | list of strings
id_length_min | integer
id_length_max | integer
id_number_msg | string
sos_address | string
sos_phone | string
sos_url | string
sub_18_msg | string

### Errors

#### Invalid state ID

Key | Value Type
--- | ----------
message | string

#### Invalid ZIP code

Key | Value Type
--- | ----------
message | string

#### Incorrect ZIP code ( ZIP does not match state)

Key | Value Type
--- | ----------
message | string

#### Non­participating state

Key | Value Type | Notes
--- | ---------- | --------
message | string | State specific

#### Invalid age

Key | Value Type | Notes
--- | ---------- | --------
message | string | State specific

#### Unsupported language

Key | Value Type
--- | ----------
message | string

#### Syntax Error

Key | Value Type | Notes
--- | ---------- | -------
message | string | 
field_name | string | Name of field that is not defined for this request

## pdf_ready

For a given registration UID, returns true or false to indicate whether the PDF for that registrant exists.

### HTTP Request

`GET /api/v4/registrations/pdf_read`

Returns status of PDF generation for the given registrant

Parameter | Type | Notes
--------- | ---- | -----
UID | string | Required.
callback | string | Optional.

### Success Response

Key | Value Type
--- | ----
pdf_ready | boolean
UID | string

### Errors


#### Invalid Partner or API key

Key | Value Type
--- | ----------
message | string


#### Not Found UID

Key | Value Type | Notes
--- | ---------- | -----
field_name | string | Value: "UID"
message | string | Value: "Registrant not found"

#### Syntax Error

Key | Value Type | Notes
--- | ---------- | -----
field_name | string | Name of field that is not defined for this request
message | string | Value: "Invalid parameter type"


## stop_reminders

### HTTP Request

`POST /api/v4/registrations/stop_reminders`

For a given registration `UID` sets `reminders_left` to 0 to prevent further reminder emails.


Parameter | Type | Notes
--------- | ---- | -----
partner_id | string | Required. Series of digits, no specific length.
partner_API_key | string | Required. No specific length.
UID | string | Required.
callback | string | Optional.

### Success

```json
{
  "UID": "123123123",
  "first_name": "Jane",
  "last_name": "Smith",
  "email_address": "me@me.com",
  "reminders_stopped": false
}
```

Key | Value Type
----- | ----
UID   | string
first_name | string
last_name | string
email_address | string
reminders_stopped | boolean

### Errors

#### Invalid Partner or API key

Key | Value Type
--- | ---------
message | string

#### Not Found UID

Key | Value Type | Note
--- | --------- |  ----
field_name | string | Value: "UID"
message | string | Value: "Registrant not found"

#### Syntax Error

Key | Value Type | Note
--- | --------- |  ----
field_name | string | Name of field that is not defined for this request
message | string | Value: "Invalid parameter type"


## reports

For a given partner, checks `partner_id` (ID in the "partners" table) and corresponding API key, and starts generation of partner­-specific registration records. Partner account was created using Rocky web UI; API key was set then, and can be reset later via admin UI. Optional "email" parameter filters the partner’s registration records, to return only those with an email address that matches the address provided in the parameter. Optional "since" parameter limits returned records to those created after the date­time provided as parameter value; the records include those that were started but not completed, and a noted via the "status" out parameter. The callback parameter is an optional string parameter, exactly as described above.


### HTTP Request

`POST /api/v4/registrant_reports.json`

Returns a status_url to call to check on the report progress. Calls to that URL will return a download_url in the response once the report is complete.

Parameter | Type | Notes
--------- | ---- | -----
partner_id | string | Required, series of digits, no specific length
partner_API_key | string | Required, no specific length
since | string | Optional, UTC datetime format
before | string | Optional, UTC datetime format
email | string | Optional, email name at domain format
callback | string | Optional
report_type | string | Optional. See valid report_type values in table below. Used to indicate an alternate CSV format with added fields.

### Valid report_type Values

Value | Description
----- | -----------
blank | Leave blank for report on the online voter registration tool.
extended | Alternate CSV format for OVR with added fields.
alert_request_report | Pledge to Vote report
abr_report | Absentee Ballot Request report
lookup_report | Voter Status Lookup report
grommet_registrants_report | PA Registration Report (PA App only)
canvassing_shift_report | Canvassing Shift Report (PA App only)
grommet_shift_report | PA Shift Report (Old versions of PA App only)

### "Extended" Report Type Field Definitions

Field | Description
----- | -----------
VR Application Status | This is specific to the PA field app. This field indicates the status of a user’s voter registration application with the state.
VR Application Status Details | This is specific to the PA field app. This field indicates the details/reason for a user’s voter registration application status.
VR Application Status Imported DateTime | This is specific to the PA field app. It indicates when the user's application status was last imported/updated.
Built via API | This field indicates that the user’s registration was created as the result of an API call, rather than a session on Rock the Vote’s default web-based user interface. This includes registrations created via the PA field app & via the nationwide Rock the Vote API.
Pre-Registered | If a user is not old enough to be fully registered (which will be noted under “Ineligible reason”), but is eligible for pre-registration in their state, this field will indicate whether they completed the pre-registration process.
Has State License | This is specific to the PA field app and indicates whether a registrant included a state-issued ID number.
Has SSN | This is specific to the PA field app and indicates whether a registrant included the last 4 digits of their SSN.
VR Application Submission Modifications | This is specific to the PA field app. This field indicates what, if any, modifications were required to submit a user’s voter registration application.
VR Application Submission Errors | This is specific to the PA field app. This field indicates what, if any, errors occurred with a user’s voter registration application.
Submitted Via State API | This field is specific to the PA field app and indicates if the registration has or has not been submitted via the State API.
Submitted Signature to State API | This field is specific to the PA field app and indicates if the registration has or has not been submitted via the State API.
utm_source, utm_medium, utm_campaign, utm_term, utm_content | utm_  source codes that you add to your tool’s URL will be located in these fields.
Other_parameters | Indicates parameters added to your base URL not listed above. 
Change of Name | This indicates whether the registrant says they had changed their name since they last registered to vote. 
Prev Name Title | Prev First Name, Prev Middle Name, Prev Last Name, Prev Name Suffix: These fields provide the previous name of the registrant as it was inputted into the OVR tool.
Registration Source | This is specific to the PA field app.
Registration Medium | This is specific to the PA field app.
Shift ID | This is specific to the PA field app.
Blocks Shift ID | This is specific to the PA field app.
Over 18 Affirmed | This is specific to the PA field app.
Preferred Language | This is specific to the PA field app.
State Flow Status | This is specific to the PA field app.
State API Transaction ID | This is specific to the PA field app.

### Success Response

JSON dictionary with details about the report generation


Key | Value Type | Notes
--- | ---------- | -----
status | string | "queued", or other current report status
report_id | integer | e.g. 17
record_count | integer | e.g. 2314 total number of records being generated by this report
current_index | integer | e.g. 100 current index of being processed by the report
status_url | string | e.g. "https://register.rockthevote.com/api/v4/registrant_reports/17"
download_url | string | may be empty if not complete

## report status

For a given partner, checks `partner_id` (ID in the "partners" table) and corresponding API key, and returns status of previously queued report.

### HTTP Request

`GET /api/v4/registrant_reports/<ID>.json`

Returns report record with ID and URL for checking report status

Parameter | Type | Notes
--------- | ---- | -----
partner_id | string | Required, series of digits, no specific length
partner_API_key | string | Required, no specific length
callback | string | Optional


### Success Response

JSON dictionary with details about the report generation


Key | Value Type | Notes
--- | ---------- | -----
status | string | "queued", or other current report status
report_id | integer | e.g. 17
record_count | integer | e.g. 2314 total number of records being generated by this report
current_index | integer | e.g. 100 current index of being processed by the report
status_url | string | e.g. "https://register.rockthevote.com/api/v4/registrant_reports/17"
download_url | string | may be empty if not complete. e.g. "https://register.rockthevote.com/api/v4/registrant_reports/17/download"


### Error Responses

#### Invalid Partner or API key

Key | Value Type
--- | ----------
message | string

#### Syntax Error

Key | Value Type | Note
--- | ---------- | -----
field_name | string | Name of field that is not defined for this request
message | string | Value: "Invalid parameter type"


## partners

Creates a new partner, very similar to partner creation in the Web UI of the partner portal.

### HTTP Request

`POST /api/v4/partners.json`

Post JSON dictionary of fields nested under `partner`

Parameter | Type | Notes
--------- | ---- | -----
org_name | string
org_URL | string | URL format
org_privacy_url | string  | Optional
contact_name | string
contact_email | string | Email address format
contact_phone | string | 'nnn­nnn­nnnn' format
contact_address | string
contact_city | string
contact_state | string |  2 letter state code)
contact_ZIP | string | 5 digits, 'nnnnn'
logo_image_URL | string | URL format)
survey_question_1_[locale] | string | Where [locale] may be any of the enabled locale codes
survey_question_2_[locale] | string | Where [locale] may be any of the enabled locale codes
partner_ask_volunteer | boolean

### Success Response

Key | Value Type | Notes
--- | ---------- | -----
partner_id | string | Series of digits

### Error Responses

#### Syntax Error

Key | Value Type | Notes
--- | ---------- | -----
field_name | string | Name of field that is not defined for this request
message | string | Value: "Invalid parameter type"

### partner

For a given partner, checks partner_id (ID in the "partners" table) and corresponding API key, and returns partner­specific profile records. Partner profile was created using Rocky web UI or API call POST partners. The callback parameter is an optional string parameter, exactly as described above.

### HTTP Request

`GET /api/v4/partners/[partner_id].json`

Parameter | Type | Notes
--------- | ---- | -----
partner_id | string | Required. Series of digits, no specific length.
callback | string | Optional.

### Success Response

Key | Value Type | Notes
--- | ---------- | -----
org_name | string
org_URL | string | URL format
org_privacy_url | string | URL format
contact_name | string
contact_email | string | Email address format
contact_phone | string  | nnn­nnn­nnnn format
contact_address | string
contact_city | string
contact_state | string |  2 letter state code
contact_ZIP | string | nnnnn format
logo_image_URL | string | URL format
application_css_URL | string | URL format
registration_css_URL | string | URL format
parnter_css_URL | string | URL format
finish_iframe_url | string | URL format
survey_question_1_[locale] | string | Where [locale] may be any enabled locale
survey_question_2_[locale] | string | Where [locale] may be any enabled locale
whitelabeled | boolean
rtv_email_opt_in | boolean
partner_email_opt_in | boolean
rtv_sms_opt_in | boolean
partner_sms_opt_in | boolean
rtv_ask_email_opt_in | boolean
partner_ask_email_opt_in | boolean
rtv_ask_sms_opt_in | boolean
partner_ask_sms_opt_in | boolean
ask_for_volunteers | boolean
partner_ask_for_volunteers | boolean
external_tracking_snippet | string
registration_instructions_url | string | URL format
application_css_present | boolean
application_css_url | string | URL format
registration_css_present | boolean
registration_css_url | string | URL format
partner_css_present | boolean
partner_css_url | string | URL format
primary | boolean

### Error Response

#### Invalid Partner or API key

Key | Value Type
--- | ----------
message | string

## partner

For a given partner, checks partner_id (ID in the "partners" table) and corresponding API key, without an API key, and returns the portion of partner­specific profile records that are not private. Intended for unauthenticated access to public information.

Partner profile was created using Rocky web UI or API call POST partners. The callback parameter is an optional string parameter, exactly as described above.

In addition to the return field names above, there are return fields that are aliases for the above, provided for internal use with Rocky. Though present in return data, the alias fields can be ignored by most callers. They are:

Field | Alias
----- | -----
organization | org_name
url | org_URL
privacy_url | org_privacy_url
name | contact_name
email | contact_email
phone | contact_phone
address | contact_address
city | contact_city
state_abbrev | contact_state
zip_code | contact_ZIP
rtv_email_opt_in | rtv_ask_email_opt_in
partner_email_opt_in | partner_ask_email_opt_in
rtv_sms_opt_in | rtv_ask_email_opt_in
partner_sms_opt_in | partner_ask_sms_opt_in

### HTTP Request

`GET /api/v4/partnerpublicprofiles/[partner_id].json`

Parameter | Type | Notes
--------- | ---- | -----
partner_id | string | Required. Series of digits, no specific length.
callback | string | Optional.

### Success Response

Key | Value Type | Notes
--- | ---------- | -----
org_name | string | URL format
org_URL | string
org_privacy_url | string
logo_image_URL | string | URL format
survey_question_1 | {hash}
survey_question_2 | {hash}
whitelabeled | boolean
rtv_ask_email_opt_in | boolean
partner_ask_email_opt_in | boolean
rtv_ask_sms_opt_in | boolean
partner_ask_sms_opt_in | boolean
rtv_ask_volunteer | boolean
partner_ask_volunteer | boolean

In addition to the return field names above, there are return fields that are aliases for the above, provided for internal use with Rocky. Though present in return data, the alias fields can be ignored by most callers. They are:

Field | Alias
----- | -----
organization | org_name
url | org_URL
privacy_url | org_privacy_url
rtv_email_opt_in | rtv_ask_email_opt_in
partner_email_opt_in | partner_ask_email_opt_in
rtv_sms_opt_in | rtv_ask_email_opt_in
partner_sms_opt_in | partner_ask_sms_opt_in

### Error Response

#### Invalid Partner or API key

Key | Value Type
--- | ----------
message | string

