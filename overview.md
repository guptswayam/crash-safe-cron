# In-memory Crash Safe Cron Service

## Feature Overview 

## API's Required
- Create a new cron job
- Update an existing cron job
- Delete a cron job
- Get all cron jobs

## Technical Overview
### Q1. What happens in create Cron API?
1. It saves the data to the database.
2. Calls the `scheduleCron` function with `firstTriggerAt` and `frequency` as argument.

### Q2. What does scheduleCron function do?
1. It schedule the cron using *node-schedule* library.
2. It call `recurrenceScheduleCron` function with `frequency` as argument


### Q3. What does recurrenceScheduleCron do?
1. It creates an entry in `Scheduled Crons` Table.
2. It schedules the recurrence cron using *node-schedule* library.


### Q3. What happens on server crash/restart?
1. On restart, `startCronsFromDB` func will run and it will fetch all the active entries of `crons` table and call `scheduleCron` for each entry.


## Database Structure

### Tables
1. crons
    - id (auto-generated)
    - name
    - frequency (MINUTELY/HOURLY/DAILY/WEEKLY/MONTHLY)
    - API Key
    - createdAt
    - webhook-url
    - firstTriggerAt
2. Scheduled Crons
    - id (auto-generated)
    - createdAt
    - updatedAt
    - status (pending, failed, completed)
    - webhook response
    - response status code
    - cronId


### Indexes
1. 


## Node-Schedule library behaviour
1. Each job scheduled by *node-schedule* has name property. It works as unique identifier for each job.
2. All currently scheduled Jobs are stored in `scheduledJobs` object by this library.
3. For a scheduled recurrence job, there be only one entry in `scheduledJobs` at a time.
4. To stop a recurrence job, we have to use call `cancel` func to defer invocations. `canel` func also deletes the job from `scheduledJobs` object.
5. Non-recurrence jobs are automatically deleted from `scheduledJobs` object after invocation.
    - To stop a Non-recurrence job before timeout, we can call `cancel` func.
6. Avoid creating jobs with same name, otherwise this library gives uneven results for those duplicate name jobs only.
    - Job that scheduled later overwrites the previous scheduled job in `scheduledJobs` object for an identifer.
    - All duplicate jobs will run at their scheduled time, we lost the record of prior jobs with same identifier in `scheduledJobs` object.
    - So, we never able to call `cancel` func on those prior duplicate jobs.
7. Beware while calling `cancel` func, as it throws *reading func of undefined* runtime error if the job doesn't exist in `scheduledJobs` object