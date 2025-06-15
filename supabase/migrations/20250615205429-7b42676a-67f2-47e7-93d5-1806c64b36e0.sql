
-- First, let's check what values exist in the job_status enum
SELECT unnest(enum_range(NULL::job_status)) as job_status_values;

-- Also check other enums that might be used in policies
SELECT unnest(enum_range(NULL::application_status)) as application_status_values;
SELECT unnest(enum_range(NULL::user_status)) as user_status_values;
SELECT unnest(enum_range(NULL::group_member_role)) as group_member_role_values;
SELECT unnest(enum_range(NULL::message_status)) as message_status_values;
