enum APIResponseCodes {
    success = 6000,
    businessValidationFailed = 6001,
    dataValidationFailed = 6002,
    technicalIssue = 6003
}

enum StatusLanguage {
    draft = 1,
    submitted = 2,
    reSubmissionRequested = 3,
    cardPrinted = 4,
    licenseIssued = 5,
    cardDispatched = 6,
    reSubmitted = 7,
    requestForReissue = 8,
    inProgress = 9,
    expired = 10
}

enum service {
    groundwaterWellsDrillingAndUse = 1,
    environmentalConsultancyOffice = 2,
    developmentAndInfrastructureProjects = 3,
    commercialEnvironmentalLicense = 4,
    industrialFacilities = 5,
    fishingPermitsAndLicenses = 6,
    aquaculture = 7,
    nativeTreesPlantationAndTranslocation = 14,
    scientificEnvironmentalResearch = 9,
    recreationalFishing = 10,
    commercialFishing = 13
}

enum subService {
    weeklyNew = 1,
    annualNew = 2,
    annualReissue = 3,
    annualRenew = 4
}

enum FacilityProjectClass {
    class1 = 1,
    class2 = 2,
    class3 = 3,
    class4 = 4
}

enum TaskTypes {
    askforInspection = 1,
    noActionRequired = 6
}

enum RasidActions {
    inProgress = 1,
    reSubmit = 2,
    reject = 3,
    reInspect = 4,
    modify = 5,
    approve = 6,
    assignInspection = 7,
    assigntoSME = 8,
    noActionRequired = 9,
    schedule = 10,
    assign = 11
}

enum RasidDispatchStatus {
    notAssigned = 1,
    assigned = 2,
    inProgress = 3,
    completed = 4
}

enum YearlyInspectionCriteria {
    sector = '1',
    activity = '2',
    location = '3',
    process = '4',
    facilityType = '5',
    isInspected = '6',
    violation = '7',
    mP = '8',
    eAP = '9',
    inspectionSchedule = '10',
    inspectionCompleted = '11',
    permitingHistory = '12'
}

enum RasidStatus {
    qAReview = 46,
    qARequestforReInspection = 47,
    qARequestforModification = 48,
    qAApproved = 49,
}

enum RasidTasks {
    qAReview = 7,
    qARequestforReInspection = 14,
    qARequestforModification = 13,
    qAApproved = 3,
}

enum RasidEnforcementConditions {
    A = 'A',
    B = 'B',
    C = 'C',
    D = 'D',
    E = 'E',
    F = 'F',

}

enum RasidInspectionAction {
    qAReview = 1,
    qARequestforReInspection = 13,
    qARequestforModification = 14,
    qAApproved = 3,
}

enum RasidRoles {
    QA = 5,
    Inspector = 4,
    Dispatcher = 7,
    Manager = 6,
    Customer = 1,
}

enum RasidQaActions {
    qAReview = '1',
    qARequestforReInspection = '13',
    qARequestforModification = '14',
    qAApproved = '3',
}

enum EQSAssistanceRequestTypes {
    TechReviewer = 1,
    SME = 2,
    Inspector = 3
}

enum YesNo {
    Yes = 1,
    No = 0
}

enum DataClassificationTypes {
    application = 1,
    studies = 2,
    auditReport = 3,
    monitoringReport = 4,
    techReviewerAssistanceRequest = 5,
    smeAssistanceRequest = 6
}

export enum InformationTypes {
    information = 1,
    error = 2
}
export enum LegalCaseAction {
    Resubmission = 29,
    Withdraw = 30,
    ChangeStatus = 31,
    Approve = 3
}

export interface iDropdown {
    label: string;
    value: number;
}

export class AppConstants {

    public static get displayDateFormat(): string {
        return 'dd/MM/yyyy';
    }

    public static get primeNgDateDisplayFormat(): string {
        return 'dd/mm/yy';
    }

    public static get datePlaceHolderFormat(): string {
        return 'DD/MM/YYYY';
    }

    public static get sendingDateFormat(): string {
        return 'yyyy-MM-dd';
    }

    public static get gridPageSize(): number {
        return 10;
    }

    public static get eqsGridPageSize(): number {
        return 5;
    }

    public static get StatusLanguage() {
        return StatusLanguage;
    }

    public static get Service() {
        return service;
    }

    public static get SubService() {
        return subService;
    }

    public static get displayDateFormatWithHHMM(): string {
        return 'dd/MM/yyyy hh:mm:ss';
    }

    public static get dateFormatWithMMSEC(): string {
        return 'hh:mm:ss';
    }

    public static get TaskTypes() {
        return TaskTypes;
    }

    public static get RasidRoles() {
        return RasidRoles;
    }

    public static get RasidEnforcementConditions() {
        return RasidEnforcementConditions;
    }

    public static get RasidQaActions() {
        return RasidQaActions;
    }


    public static get RasidTasks() {
        return RasidTasks;
    }

    public static get RasidActions() {
        return RasidActions;
    }
    public static get RasidDispatchStatus() {
        return RasidDispatchStatus;
    }

    public static get yearRange(): string {
        return '2000:2030';
    }

    public static get YearlyInspectionCriteria() {
        return YearlyInspectionCriteria;
    }

    public static get APIResponseCodes() {
        return APIResponseCodes;
    }

    public static get maxFileUploadSize() {
        return 2097152;
    }

    public static get fileTypesToAllowUpload() {
        return '.JPG,.JPEG,.PNG,.PDF';
    }

    public static get eqsMaxFileUploadSize() {
        return 5242880; // 5 * 1024 * 1024
    }

    public static get eqsFileTypesToAllowUpload() {
        return '.JPG,.JPEG,.PNG,.PDF';
    }

    public static get eqsAssistanceRequestType() {
        return EQSAssistanceRequestTypes;
    }

    public static get InformationType() {
        return InformationTypes;
    }

    public static get facilityProjectClass() {
        return FacilityProjectClass;
    }

    public static get yesNo() {
        return YesNo;
    }

    public static get dataClassificationTypes() {
        return DataClassificationTypes;
    }

    public static get currentDate(): Date {
        return new Date();
    }
    public static get LegalCaseAction() {
        return LegalCaseAction;
    }
}
