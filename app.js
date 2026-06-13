const catalog = window.INDUSCOUT_DATA || {};
const products = catalog.products || [];
const categoryTaxonomy = catalog.categoryTaxonomy || [];
const sourceChannels = catalog.sourceChannels || [];
const sourceDirectory = catalog.sourceDirectory || [];
const SESSION_IMPORT_MAX_BYTES = 750000;
const SPEC_SOURCE_REQUIREMENTS = ["any", "oem-distributor", "datasheet", "verified"];
const SPEC_CRITICALITY_LEVELS = ["Standard sourcing", "Production critical", "Safety or process critical", "Obsolete replacement"];
const ALTERNATE_CRITICALITY_LEVELS = ["Standard spare", "Production critical", "Safety or process critical", "Obsolete or no-stock replacement"];
const APPROVAL_DECISIONS = ["Engineering review required", "Approved for RFQ only", "Approved substitute", "Trial order only", "Rejected substitute"];

const state = {
  query: "",
  category: "all",
  region: "all",
  sourceType: "all",
  confidence: "all",
  priority: "balanced",
  datasheetOnly: false,
  verifiedOnly: false,
  shortlist: [],
  compare: [],
  notes: loadNotes(),
  productRequests: loadProductRequests(),
  sourceLeads: loadSourceLeads(),
  launchPartners: loadLaunchPartners(),
  pilotRuns: loadPilotRuns(),
  quotes: loadQuoteRecords(),
  savingsRecords: loadSavingsRecords(),
  supplierReplies: loadSupplierReplies(),
  project: loadProjectProfile(),
  specRequirements: loadSpecRequirements(),
  alternateReview: loadAlternateReview(),
  substitutionApproval: loadSubstitutionApproval(),
  landedCost: loadLandedCostScenario(),
  negotiationPlan: loadNegotiationPlan(),
  learningRecords: loadLearningRecords(),
  playbookConfig: loadPlaybookConfig(),
  playbookRules: loadPlaybookRules(),
  reinforcementSignals: loadReinforcementSignals(),
  governancePolicy: loadGovernancePolicy(),
  learningApprovals: loadLearningApprovals(),
  backendFoundation: loadBackendFoundation(),
  activeProductId: null
};

const els = {
  search: document.querySelector("#globalSearch"),
  heroSearch: document.querySelector("#heroSearch"),
  finderSearch: document.querySelector("#finderSearchInput"),
  finderSearchForm: document.querySelector("#finderSearch"),
  category: document.querySelector("#categoryFilter"),
  region: document.querySelector("#regionFilter"),
  sourceType: document.querySelector("#sourceTypeFilter"),
  confidence: document.querySelector("#confidenceFilter"),
  datasheetOnly: document.querySelector("#datasheetOnly"),
  verifiedOnly: document.querySelector("#verifiedOnly"),
  saveSession: document.querySelector("#saveSession"),
  loadSession: document.querySelector("#loadSession"),
  exportSession: document.querySelector("#exportSession"),
  importSession: document.querySelector("#importSession"),
  importSessionFile: document.querySelector("#importSessionFile"),
  sessionStatus: document.querySelector("#sessionStatus"),
  projectWorkspace: document.querySelector("#projectWorkspace"),
  projectStatus: document.querySelector("#projectStatus"),
  projectName: document.querySelector("#projectName"),
  projectBuyer: document.querySelector("#projectBuyer"),
  projectContact: document.querySelector("#projectContact"),
  projectCountry: document.querySelector("#projectCountry"),
  projectTargetDate: document.querySelector("#projectTargetDate"),
  projectNotes: document.querySelector("#projectNotes"),
  saveProject: document.querySelector("#saveProject"),
  copyProjectBrief: document.querySelector("#copyProjectBrief"),
  clearProject: document.querySelector("#clearProject"),
  productRequestPanel: document.querySelector("#productRequestPanel"),
  requestPart: document.querySelector("#requestPart"),
  requestBrand: document.querySelector("#requestBrand"),
  requestCategory: document.querySelector("#requestCategory"),
  requestCountry: document.querySelector("#requestCountry"),
  requestUrgency: document.querySelector("#requestUrgency"),
  requestQuantity: document.querySelector("#requestQuantity"),
  requestNotes: document.querySelector("#requestNotes"),
  copyProductRequest: document.querySelector("#copyProductRequest"),
  saveProductRequest: document.querySelector("#saveProductRequest"),
  copyResearchBrief: document.querySelector("#copyResearchBrief"),
  clearProductRequest: document.querySelector("#clearProductRequest"),
  requestList: document.querySelector("#requestList"),
  requestCount: document.querySelector("#requestCount"),
  resultCount: document.querySelector("#resultCount"),
  resultSummary: document.querySelector("#resultSummary"),
  results: document.querySelector("#resultsGrid"),
  sourceGrid: document.querySelector("#sourceGrid"),
  sourceDirectory: document.querySelector("#sourceDirectory"),
  sourceIntakeSummary: document.querySelector("#sourceIntakeSummary"),
  sourceLeadForm: document.querySelector("#sourceIntakeForm"),
  sourceLeadId: document.querySelector("#sourceLeadId"),
  sourceLeadName: document.querySelector("#sourceLeadName"),
  sourceLeadWebsite: document.querySelector("#sourceLeadWebsite"),
  sourceLeadType: document.querySelector("#sourceLeadType"),
  sourceLeadCategory: document.querySelector("#sourceLeadCategory"),
  sourceLeadRegion: document.querySelector("#sourceLeadRegion"),
  sourceLeadEvidence: document.querySelector("#sourceLeadEvidence"),
  sourceLeadContact: document.querySelector("#sourceLeadContact"),
  sourceLeadStatus: document.querySelector("#sourceLeadStatus"),
  sourceLeadNotes: document.querySelector("#sourceLeadNotes"),
  saveSourceLead: document.querySelector("#saveSourceLead"),
  copySourceLead: document.querySelector("#copySourceLead"),
  exportSourceLeadCsv: document.querySelector("#exportSourceLeadCsv"),
  exportSourceLeadXlsx: document.querySelector("#exportSourceLeadXlsx"),
  clearSourceLead: document.querySelector("#clearSourceLead"),
  clearSourceLeads: document.querySelector("#clearSourceLeads"),
  sourceLeadRegisterStatus: document.querySelector("#sourceLeadRegisterStatus"),
  sourceLeadList: document.querySelector("#sourceLeadList"),
  categoryGrid: document.querySelector("#categoryGrid"),
  priorityButtons: [...document.querySelectorAll("[data-priority]")],
  reset: document.querySelector("#resetFilters"),
  shortlistDrawer: document.querySelector("#shortlistDrawer"),
  productDetail: document.querySelector("#productDetail"),
  shortlistToggle: document.querySelector("#shortlistToggle"),
  closeShortlist: document.querySelector("#closeShortlist"),
  closeProductDetail: document.querySelector("#closeProductDetail"),
  scrim: document.querySelector("#scrim"),
  shortlistProjectSummary: document.querySelector("#shortlistProjectSummary"),
  shortlistItems: document.querySelector("#shortlistItems"),
  productDetailContent: document.querySelector("#productDetailContent"),
  shortlistCount: document.querySelector("#shortlistCount"),
  clearShortlist: document.querySelector("#clearShortlist"),
  copyShortlist: document.querySelector("#copyShortlist"),
  downloadRfqPack: document.querySelector("#downloadRfqPack"),
  downloadShortlistXlsx: document.querySelector("#downloadShortlistXlsx"),
  downloadShortlist: document.querySelector("#downloadShortlist"),
  exportShortlist: document.querySelector("#exportShortlist"),
  openCompare: document.querySelector("#openCompare"),
  compareCount: document.querySelector("#compareCount"),
  compareSummary: document.querySelector("#compareSummary"),
  compareGrid: document.querySelector("#compareGrid"),
  clearCompare: document.querySelector("#clearCompare"),
  copyCompare: document.querySelector("#copyCompare"),
  specForm: document.querySelector("#specForm"),
  specApplication: document.querySelector("#specApplication"),
  specMustHave: document.querySelector("#specMustHave"),
  specCertifications: document.querySelector("#specCertifications"),
  specSourceRequirement: document.querySelector("#specSourceRequirement"),
  specCriticality: document.querySelector("#specCriticality"),
  saveSpecRequirements: document.querySelector("#saveSpecRequirements"),
  resetSpecRequirements: document.querySelector("#resetSpecRequirements"),
  copySpecMatrix: document.querySelector("#copySpecMatrix"),
  downloadSpecMatrix: document.querySelector("#downloadSpecMatrix"),
  exportSpecMatrixJson: document.querySelector("#exportSpecMatrixJson"),
  specMatchStats: document.querySelector("#specMatchStats"),
  specMatchSummary: document.querySelector("#specMatchSummary"),
  specMatchGrid: document.querySelector("#specMatchGrid"),
  alternateForm: document.querySelector("#alternateForm"),
  alternateProduct: document.querySelector("#alternateProduct"),
  alternateCriticality: document.querySelector("#alternateCriticality"),
  alternateEquipment: document.querySelector("#alternateEquipment"),
  alternateConstraint: document.querySelector("#alternateConstraint"),
  saveAlternateDesk: document.querySelector("#saveAlternateDesk"),
  resetAlternateDesk: document.querySelector("#resetAlternateDesk"),
  copyAlternateReview: document.querySelector("#copyAlternateReview"),
  downloadAlternateReview: document.querySelector("#downloadAlternateReview"),
  exportAlternateJson: document.querySelector("#exportAlternateJson"),
  alternateStats: document.querySelector("#alternateStats"),
  alternateSummary: document.querySelector("#alternateSummary"),
  alternateGrid: document.querySelector("#alternateGrid"),
  approvalForm: document.querySelector("#approvalForm"),
  approvalBase: document.querySelector("#approvalBase"),
  approvalCandidate: document.querySelector("#approvalCandidate"),
  approvalDecision: document.querySelector("#approvalDecision"),
  approvalReviewer: document.querySelector("#approvalReviewer"),
  approvalEquipment: document.querySelector("#approvalEquipment"),
  approvalNotes: document.querySelector("#approvalNotes"),
  approvalCheckModel: document.querySelector("#approvalCheckModel"),
  approvalCheckDatasheet: document.querySelector("#approvalCheckDatasheet"),
  approvalCheckInterface: document.querySelector("#approvalCheckInterface"),
  approvalCheckSafety: document.querySelector("#approvalCheckSafety"),
  approvalCheckSupplier: document.querySelector("#approvalCheckSupplier"),
  saveApprovalPack: document.querySelector("#saveApprovalPack"),
  resetApprovalPack: document.querySelector("#resetApprovalPack"),
  copyApprovalPack: document.querySelector("#copyApprovalPack"),
  downloadApprovalPack: document.querySelector("#downloadApprovalPack"),
  exportApprovalJson: document.querySelector("#exportApprovalJson"),
  approvalStats: document.querySelector("#approvalStats"),
  approvalSummary: document.querySelector("#approvalSummary"),
  approvalPreview: document.querySelector("#approvalPreview"),
  quoteSummary: document.querySelector("#quoteSummary"),
  quoteForm: document.querySelector("#quoteForm"),
  quoteId: document.querySelector("#quoteId"),
  quoteProduct: document.querySelector("#quoteProduct"),
  quoteSupplier: document.querySelector("#quoteSupplier"),
  quoteStatus: document.querySelector("#quoteStatus"),
  quoteCurrency: document.querySelector("#quoteCurrency"),
  quoteUnitPrice: document.querySelector("#quoteUnitPrice"),
  quoteQuantity: document.querySelector("#quoteQuantity"),
  quoteLeadTime: document.querySelector("#quoteLeadTime"),
  quoteMoq: document.querySelector("#quoteMoq"),
  quotePaymentTerms: document.querySelector("#quotePaymentTerms"),
  quoteDeliveryTerms: document.querySelector("#quoteDeliveryTerms"),
  quoteValidUntil: document.querySelector("#quoteValidUntil"),
  quoteSourceUrl: document.querySelector("#quoteSourceUrl"),
  quoteNotes: document.querySelector("#quoteNotes"),
  saveQuote: document.querySelector("#saveQuote"),
  clearQuote: document.querySelector("#clearQuote"),
  copyQuoteSummary: document.querySelector("#copyQuoteSummary"),
  copyQuoteFollowup: document.querySelector("#copyQuoteFollowup"),
  exportQuoteCsv: document.querySelector("#exportQuoteCsv"),
  exportQuoteXlsx: document.querySelector("#exportQuoteXlsx"),
  clearQuotes: document.querySelector("#clearQuotes"),
  quoteRegisterStatus: document.querySelector("#quoteRegisterStatus"),
  quoteList: document.querySelector("#quoteList"),
  costForm: document.querySelector("#costForm"),
  costProduct: document.querySelector("#costProduct"),
  costQuote: document.querySelector("#costQuote"),
  costSupplier: document.querySelector("#costSupplier"),
  costCurrency: document.querySelector("#costCurrency"),
  costUnitPrice: document.querySelector("#costUnitPrice"),
  costQuantity: document.querySelector("#costQuantity"),
  costFreight: document.querySelector("#costFreight"),
  costDutyRate: document.querySelector("#costDutyRate"),
  costTaxRate: document.querySelector("#costTaxRate"),
  costHandling: document.querySelector("#costHandling"),
  costBankCharges: document.querySelector("#costBankCharges"),
  costFxBuffer: document.querySelector("#costFxBuffer"),
  costDeliveryTerms: document.querySelector("#costDeliveryTerms"),
  costCountry: document.querySelector("#costCountry"),
  costNotes: document.querySelector("#costNotes"),
  saveCostScenario: document.querySelector("#saveCostScenario"),
  resetCostScenario: document.querySelector("#resetCostScenario"),
  copyCostBrief: document.querySelector("#copyCostBrief"),
  downloadCostHtml: document.querySelector("#downloadCostHtml"),
  exportCostJson: document.querySelector("#exportCostJson"),
  costStats: document.querySelector("#costStats"),
  costSummary: document.querySelector("#costSummary"),
  costPreview: document.querySelector("#costPreview"),
  negotiationForm: document.querySelector("#negotiationForm"),
  negotiationProduct: document.querySelector("#negotiationProduct"),
  negotiationQuote: document.querySelector("#negotiationQuote"),
  negotiationSupplier: document.querySelector("#negotiationSupplier"),
  negotiationCurrency: document.querySelector("#negotiationCurrency"),
  negotiationCurrentPrice: document.querySelector("#negotiationCurrentPrice"),
  negotiationQuantity: document.querySelector("#negotiationQuantity"),
  negotiationTargetPrice: document.querySelector("#negotiationTargetPrice"),
  negotiationDiscount: document.querySelector("#negotiationDiscount"),
  negotiationLeadTime: document.querySelector("#negotiationLeadTime"),
  negotiationValidity: document.querySelector("#negotiationValidity"),
  negotiationLeverage: document.querySelector("#negotiationLeverage"),
  negotiationReason: document.querySelector("#negotiationReason"),
  negotiationNotes: document.querySelector("#negotiationNotes"),
  saveNegotiationPlan: document.querySelector("#saveNegotiationPlan"),
  resetNegotiationPlan: document.querySelector("#resetNegotiationPlan"),
  copyNegotiationEmail: document.querySelector("#copyNegotiationEmail"),
  copySavingsNote: document.querySelector("#copySavingsNote"),
  downloadNegotiationHtml: document.querySelector("#downloadNegotiationHtml"),
  exportNegotiationJson: document.querySelector("#exportNegotiationJson"),
  negotiationStats: document.querySelector("#negotiationStats"),
  negotiationSummary: document.querySelector("#negotiationSummary"),
  negotiationPreview: document.querySelector("#negotiationPreview"),
  savingsSummary: document.querySelector("#savingsSummary"),
  savingsForm: document.querySelector("#savingsForm"),
  savingsId: document.querySelector("#savingsId"),
  savingsProduct: document.querySelector("#savingsProduct"),
  savingsQuote: document.querySelector("#savingsQuote"),
  savingsSupplier: document.querySelector("#savingsSupplier"),
  savingsCurrency: document.querySelector("#savingsCurrency"),
  savingsBaselineUnit: document.querySelector("#savingsBaselineUnit"),
  savingsFinalUnit: document.querySelector("#savingsFinalUnit"),
  savingsQuantity: document.querySelector("#savingsQuantity"),
  savingsStatus: document.querySelector("#savingsStatus"),
  savingsOwner: document.querySelector("#savingsOwner"),
  savingsEvidenceUrl: document.querySelector("#savingsEvidenceUrl"),
  savingsDate: document.querySelector("#savingsDate"),
  savingsNotes: document.querySelector("#savingsNotes"),
  saveSavingsRecord: document.querySelector("#saveSavingsRecord"),
  useNegotiationPlan: document.querySelector("#useNegotiationPlan"),
  clearSavingsForm: document.querySelector("#clearSavingsForm"),
  copySavingsRegister: document.querySelector("#copySavingsRegister"),
  exportSavingsCsv: document.querySelector("#exportSavingsCsv"),
  exportSavingsJson: document.querySelector("#exportSavingsJson"),
  clearSavingsRecords: document.querySelector("#clearSavingsRecords"),
  savingsRegisterStatus: document.querySelector("#savingsRegisterStatus"),
  savingsList: document.querySelector("#savingsList"),
  learningSummary: document.querySelector("#learningSummary"),
  learningForm: document.querySelector("#learningForm"),
  learningId: document.querySelector("#learningId"),
  learningProduct: document.querySelector("#learningProduct"),
  learningSupplier: document.querySelector("#learningSupplier"),
  learningOutcome: document.querySelector("#learningOutcome"),
  learningCycleTime: document.querySelector("#learningCycleTime"),
  learningSaving: document.querySelector("#learningSaving"),
  learningConfidence: document.querySelector("#learningConfidence"),
  learningPattern: document.querySelector("#learningPattern"),
  learningLesson: document.querySelector("#learningLesson"),
  learningRecommendation: document.querySelector("#learningRecommendation"),
  saveLearningRecord: document.querySelector("#saveLearningRecord"),
  prefillLearningFromDecision: document.querySelector("#prefillLearningFromDecision"),
  clearLearningForm: document.querySelector("#clearLearningForm"),
  copyLearningReport: document.querySelector("#copyLearningReport"),
  exportLearningCsv: document.querySelector("#exportLearningCsv"),
  exportLearningJson: document.querySelector("#exportLearningJson"),
  clearLearningRecords: document.querySelector("#clearLearningRecords"),
  learningRegisterStatus: document.querySelector("#learningRegisterStatus"),
  learningList: document.querySelector("#learningList"),
  playbookSummary: document.querySelector("#playbookSummary"),
  playbookForm: document.querySelector("#playbookForm"),
  playbookGoal: document.querySelector("#playbookGoal"),
  playbookEvidence: document.querySelector("#playbookEvidence"),
  playbookScope: document.querySelector("#playbookScope"),
  promotePlaybookRule: document.querySelector("#promotePlaybookRule"),
  copyPlaybookBrief: document.querySelector("#copyPlaybookBrief"),
  exportPlaybookJson: document.querySelector("#exportPlaybookJson"),
  clearPlaybookRules: document.querySelector("#clearPlaybookRules"),
  playbookRecommendations: document.querySelector("#playbookRecommendations"),
  playbookRegisterStatus: document.querySelector("#playbookRegisterStatus"),
  playbookList: document.querySelector("#playbookList"),
  signalSummary: document.querySelector("#signalSummary"),
  signalForm: document.querySelector("#signalForm"),
  signalId: document.querySelector("#signalId"),
  signalProduct: document.querySelector("#signalProduct"),
  signalModule: document.querySelector("#signalModule"),
  signalFeedback: document.querySelector("#signalFeedback"),
  signalOutcome: document.querySelector("#signalOutcome"),
  signalImpact: document.querySelector("#signalImpact"),
  signalEvidence: document.querySelector("#signalEvidence"),
  signalConfidence: document.querySelector("#signalConfidence"),
  signalNote: document.querySelector("#signalNote"),
  saveSignalRecord: document.querySelector("#saveSignalRecord"),
  prefillSignalContext: document.querySelector("#prefillSignalContext"),
  clearSignalForm: document.querySelector("#clearSignalForm"),
  copySignalReport: document.querySelector("#copySignalReport"),
  exportSignalCsv: document.querySelector("#exportSignalCsv"),
  exportSignalJson: document.querySelector("#exportSignalJson"),
  clearSignalRecords: document.querySelector("#clearSignalRecords"),
  signalRegisterStatus: document.querySelector("#signalRegisterStatus"),
  signalRecommendations: document.querySelector("#signalRecommendations"),
  signalList: document.querySelector("#signalList"),
  governanceSummary: document.querySelector("#governanceSummary"),
  governanceForm: document.querySelector("#governanceForm"),
  governanceBoundary: document.querySelector("#governanceBoundary"),
  governanceEvidence: document.querySelector("#governanceEvidence"),
  governanceCommercial: document.querySelector("#governanceCommercial"),
  governancePersonal: document.querySelector("#governancePersonal"),
  copyGovernanceBrief: document.querySelector("#copyGovernanceBrief"),
  exportGovernanceJson: document.querySelector("#exportGovernanceJson"),
  governanceMatrix: document.querySelector("#governanceMatrix"),
  governanceRecommendations: document.querySelector("#governanceRecommendations"),
  learningQueueSummary: document.querySelector("#learningQueueSummary"),
  learningQueueStatus: document.querySelector("#learningQueueStatus"),
  learningQueueFilter: document.querySelector("#learningQueueFilter"),
  learningQueueRisk: document.querySelector("#learningQueueRisk"),
  approveSafeLearning: document.querySelector("#approveSafeLearning"),
  copyLearningQueue: document.querySelector("#copyLearningQueue"),
  exportLearningQueueJson: document.querySelector("#exportLearningQueueJson"),
  learningQueueList: document.querySelector("#learningQueueList"),
  aiLoopSummary: document.querySelector("#aiLoopSummary"),
  aiLoopStatus: document.querySelector("#aiLoopStatus"),
  copyAiLoopBrief: document.querySelector("#copyAiLoopBrief"),
  exportAiLoopJson: document.querySelector("#exportAiLoopJson"),
  aiLoopPipeline: document.querySelector("#aiLoopPipeline"),
  aiLoopRecommendations: document.querySelector("#aiLoopRecommendations"),
  tenantAdminSummary: document.querySelector("#tenantAdminSummary"),
  tenantAdminStatus: document.querySelector("#tenantAdminStatus"),
  copyTenantAdminBrief: document.querySelector("#copyTenantAdminBrief"),
  exportTenantAdminJson: document.querySelector("#exportTenantAdminJson"),
  tenantRoleGrid: document.querySelector("#tenantRoleGrid"),
  tenantControlGrid: document.querySelector("#tenantControlGrid"),
  tenantAuditList: document.querySelector("#tenantAuditList"),
  integrationSummary: document.querySelector("#integrationSummary"),
  integrationStatus: document.querySelector("#integrationStatus"),
  copyIntegrationBrief: document.querySelector("#copyIntegrationBrief"),
  exportIntegrationJson: document.querySelector("#exportIntegrationJson"),
  integrationEndpointGrid: document.querySelector("#integrationEndpointGrid"),
  integrationControlGrid: document.querySelector("#integrationControlGrid"),
  integrationEventList: document.querySelector("#integrationEventList"),
  saasGateSummary: document.querySelector("#saasGateSummary"),
  saasGateStatus: document.querySelector("#saasGateStatus"),
  copySaasGateBrief: document.querySelector("#copySaasGateBrief"),
  exportSaasGateJson: document.querySelector("#exportSaasGateJson"),
  saasGateGrid: document.querySelector("#saasGateGrid"),
  saasGateSequence: document.querySelector("#saasGateSequence"),
  foundationSummary: document.querySelector("#foundationSummary"),
  foundationStatus: document.querySelector("#foundationStatus"),
  foundationForm: document.querySelector("#foundationForm"),
  foundationIdentity: document.querySelector("#foundationIdentity"),
  foundationDataModel: document.querySelector("#foundationDataModel"),
  foundationAudit: document.querySelector("#foundationAudit"),
  foundationOps: document.querySelector("#foundationOps"),
  foundationLearning: document.querySelector("#foundationLearning"),
  foundationDeployment: document.querySelector("#foundationDeployment"),
  foundationOwner: document.querySelector("#foundationOwner"),
  foundationTargetDate: document.querySelector("#foundationTargetDate"),
  foundationNotes: document.querySelector("#foundationNotes"),
  saveFoundationPlan: document.querySelector("#saveFoundationPlan"),
  copyFoundationBrief: document.querySelector("#copyFoundationBrief"),
  exportFoundationJson: document.querySelector("#exportFoundationJson"),
  resetFoundationPlan: document.querySelector("#resetFoundationPlan"),
  foundationMatrix: document.querySelector("#foundationMatrix"),
  foundationRoadmap: document.querySelector("#foundationRoadmap"),
  pilotPackSummary: document.querySelector("#pilotPackSummary"),
  pilotPackStatus: document.querySelector("#pilotPackStatus"),
  copyPilotPackBrief: document.querySelector("#copyPilotPackBrief"),
  exportPilotPackJson: document.querySelector("#exportPilotPackJson"),
  pilotPackGrid: document.querySelector("#pilotPackGrid"),
  pilotPackSequence: document.querySelector("#pilotPackSequence"),
  demoProofSummary: document.querySelector("#demoProofSummary"),
  demoProofStatus: document.querySelector("#demoProofStatus"),
  copyDemoProofBrief: document.querySelector("#copyDemoProofBrief"),
  exportDemoProofJson: document.querySelector("#exportDemoProofJson"),
  demoProofGrid: document.querySelector("#demoProofGrid"),
  demoProofSequence: document.querySelector("#demoProofSequence"),
  demoProofObjections: document.querySelector("#demoProofObjections"),
  valueProofSummary: document.querySelector("#valueProofSummary"),
  valueProofStatus: document.querySelector("#valueProofStatus"),
  copyValueProofBrief: document.querySelector("#copyValueProofBrief"),
  exportValueProofJson: document.querySelector("#exportValueProofJson"),
  valueProofGrid: document.querySelector("#valueProofGrid"),
  valueProofPath: document.querySelector("#valueProofPath"),
  valueProofEvidence: document.querySelector("#valueProofEvidence"),
  partnerSummary: document.querySelector("#partnerSummary"),
  partnerPipelineStatus: document.querySelector("#partnerPipelineStatus"),
  partnerForm: document.querySelector("#partnerForm"),
  partnerId: document.querySelector("#partnerId"),
  partnerCompany: document.querySelector("#partnerCompany"),
  partnerContact: document.querySelector("#partnerContact"),
  partnerSegment: document.querySelector("#partnerSegment"),
  partnerRegion: document.querySelector("#partnerRegion"),
  partnerLane: document.querySelector("#partnerLane"),
  partnerStatus: document.querySelector("#partnerStatus"),
  partnerFit: document.querySelector("#partnerFit"),
  partnerNextDate: document.querySelector("#partnerNextDate"),
  partnerNotes: document.querySelector("#partnerNotes"),
  savePartner: document.querySelector("#savePartner"),
  copyPartnerOutreach: document.querySelector("#copyPartnerOutreach"),
  clearPartnerForm: document.querySelector("#clearPartnerForm"),
  copyPartnerReport: document.querySelector("#copyPartnerReport"),
  exportPartnerCsv: document.querySelector("#exportPartnerCsv"),
  exportPartnerJson: document.querySelector("#exportPartnerJson"),
  clearPartners: document.querySelector("#clearPartners"),
  partnerList: document.querySelector("#partnerList"),
  pilotOpsSummary: document.querySelector("#pilotOpsSummary"),
  pilotOpsStatus: document.querySelector("#pilotOpsStatus"),
  pilotOpsForm: document.querySelector("#pilotOpsForm"),
  pilotOpsId: document.querySelector("#pilotOpsId"),
  pilotOpsPartner: document.querySelector("#pilotOpsPartner"),
  pilotOpsLane: document.querySelector("#pilotOpsLane"),
  pilotOpsStage: document.querySelector("#pilotOpsStage"),
  pilotOpsOwner: document.querySelector("#pilotOpsOwner"),
  pilotOpsStartDate: document.querySelector("#pilotOpsStartDate"),
  pilotOpsTargetDate: document.querySelector("#pilotOpsTargetDate"),
  pilotOpsSuccessMetric: document.querySelector("#pilotOpsSuccessMetric"),
  pilotOpsRisk: document.querySelector("#pilotOpsRisk"),
  pilotOpsOutcome: document.querySelector("#pilotOpsOutcome"),
  pilotOpsNotes: document.querySelector("#pilotOpsNotes"),
  savePilotOps: document.querySelector("#savePilotOps"),
  copyPilotOpsBrief: document.querySelector("#copyPilotOpsBrief"),
  clearPilotOpsForm: document.querySelector("#clearPilotOpsForm"),
  copyPilotOpsReport: document.querySelector("#copyPilotOpsReport"),
  exportPilotOpsCsv: document.querySelector("#exportPilotOpsCsv"),
  exportPilotOpsJson: document.querySelector("#exportPilotOpsJson"),
  clearPilotOps: document.querySelector("#clearPilotOps"),
  pilotOpsList: document.querySelector("#pilotOpsList"),
  inboxSummary: document.querySelector("#inboxSummary"),
  replyForm: document.querySelector("#replyForm"),
  replyId: document.querySelector("#replyId"),
  replyQuote: document.querySelector("#replyQuote"),
  replySupplier: document.querySelector("#replySupplier"),
  replyStatus: document.querySelector("#replyStatus"),
  replyAction: document.querySelector("#replyAction"),
  replyDate: document.querySelector("#replyDate"),
  replySubject: document.querySelector("#replySubject"),
  replyMessage: document.querySelector("#replyMessage"),
  replyNotes: document.querySelector("#replyNotes"),
  saveReply: document.querySelector("#saveReply"),
  clearReply: document.querySelector("#clearReply"),
  copyBuyerReply: document.querySelector("#copyBuyerReply"),
  convertReplyQuote: document.querySelector("#convertReplyQuote"),
  exportReplyCsv: document.querySelector("#exportReplyCsv"),
  exportReplyXlsx: document.querySelector("#exportReplyXlsx"),
  clearReplies: document.querySelector("#clearReplies"),
  replyRegisterStatus: document.querySelector("#replyRegisterStatus"),
  replyList: document.querySelector("#replyList"),
  supplierScoreStats: document.querySelector("#supplierScoreStats"),
  supplierScoreTitle: document.querySelector("#supplierScoreTitle"),
  supplierScoreGrid: document.querySelector("#supplierScoreGrid"),
  copySupplierScorecard: document.querySelector("#copySupplierScorecard"),
  downloadSupplierScorecard: document.querySelector("#downloadSupplierScorecard"),
  exportSupplierScorecardJson: document.querySelector("#exportSupplierScorecardJson"),
  copyPrivacyBrief: document.querySelector("#copyPrivacyBrief"),
  workspaceMetrics: document.querySelector("#workspaceMetrics"),
  workspaceProjectTitle: document.querySelector("#workspaceProjectTitle"),
  workspaceProjectFacts: document.querySelector("#workspaceProjectFacts"),
  workspaceNextActions: document.querySelector("#workspaceNextActions"),
  workspaceLanes: document.querySelector("#workspaceLanes"),
  copyWorkspaceBrief: document.querySelector("#copyWorkspaceBrief"),
  exportWorkspaceSnapshot: document.querySelector("#exportWorkspaceSnapshot"),
  reviewStats: document.querySelector("#reviewStats"),
  reviewQueueList: document.querySelector("#reviewQueueList"),
  reviewActionPlan: document.querySelector("#reviewActionPlan"),
  copyReviewBoard: document.querySelector("#copyReviewBoard"),
  exportReviewBoardJson: document.querySelector("#exportReviewBoardJson"),
  decisionStats: document.querySelector("#decisionStats"),
  decisionMemoTitle: document.querySelector("#decisionMemoTitle"),
  decisionMemoBody: document.querySelector("#decisionMemoBody"),
  copyDecisionMemo: document.querySelector("#copyDecisionMemo"),
  downloadDecisionMemo: document.querySelector("#downloadDecisionMemo"),
  awardStats: document.querySelector("#awardStats"),
  awardHandoverTitle: document.querySelector("#awardHandoverTitle"),
  awardChecklist: document.querySelector("#awardChecklist"),
  awardHandoverBody: document.querySelector("#awardHandoverBody"),
  copyAwardHandover: document.querySelector("#copyAwardHandover"),
  copySupplierAwardEmail: document.querySelector("#copySupplierAwardEmail"),
  downloadAwardHandover: document.querySelector("#downloadAwardHandover"),
  complianceStats: document.querySelector("#complianceStats"),
  complianceTitle: document.querySelector("#complianceTitle"),
  complianceChecklist: document.querySelector("#complianceChecklist"),
  complianceBody: document.querySelector("#complianceBody"),
  copyCompliancePack: document.querySelector("#copyCompliancePack"),
  copySupplierDueDiligence: document.querySelector("#copySupplierDueDiligence"),
  downloadCompliancePack: document.querySelector("#downloadCompliancePack"),
  buyerFileStats: document.querySelector("#buyerFileStats"),
  buyerFileTitle: document.querySelector("#buyerFileTitle"),
  buyerFileChecklist: document.querySelector("#buyerFileChecklist"),
  buyerFileTimeline: document.querySelector("#buyerFileTimeline"),
  copyBuyerFile: document.querySelector("#copyBuyerFile"),
  downloadBuyerFileHtml: document.querySelector("#downloadBuyerFileHtml"),
  exportBuyerFileJson: document.querySelector("#exportBuyerFileJson"),
  qualityStats: document.querySelector("#qualityStats"),
  qualityCategoryGrid: document.querySelector("#qualityCategoryGrid"),
  qualityReviewList: document.querySelector("#qualityReviewList"),
  categoryCount: document.querySelector("#categoryCount"),
  productCount: document.querySelector("#productCount"),
  sourceCount: document.querySelector("#sourceCount")
};

const categories = categoryTaxonomy.length
  ? categoryTaxonomy.map((category) => category.name)
  : [...new Set(products.map((product) => product.category))].sort();

const sourceTypes = [...new Set(products.flatMap((product) => product.sources.map((source) => source.type)))].sort();

function init() {
  renderMetrics();
  populateFilters();
  populateQuoteProducts();
  populateCostProducts();
  populateCostQuotes();
  populateNegotiationProducts();
  populateNegotiationQuotes();
  populateSavingsProducts();
  populateSavingsQuotes();
  populateLearningProducts();
  populateSignalProducts();
  populateAlternateProducts();
  populateApprovalProducts();
  hydrateFromUrl();
  hydrateProjectFields();
  hydrateSpecRequirementFields();
  hydrateAlternateReviewFields();
  hydrateSubstitutionApprovalFields();
  hydrateLandedCostFields();
  hydrateNegotiationFields();
  hydrateSavingsForm();
  hydrateLearningForm();
  hydratePlaybookControls();
  hydrateSignalForm();
  hydrateGovernanceControls();
  renderCategories();
  renderSources();
  renderSourceDirectory();
  renderSourceIntake();
  renderEvidenceReviewBoard();
  renderDecisionMemo();
  renderAwardHandover();
  renderComplianceGate();
  renderBuyerFile();
  renderQualityDashboard();
  wireEvents();
  renderProjectStatus();
  renderProductRequests();
  renderCompare();
  renderSpecMatchDesk();
  renderAlternateDesk();
  renderSubstitutionApprovalPack();
  renderQuoteTracker();
  renderLandedCostDesk();
  renderNegotiationDesk();
  renderSavingsRegister();
  renderLearningLoop();
  renderPlaybookLab();
  renderReinforcementLab();
  renderGovernanceCenter();
  renderLearningQueue();
  renderAiLoop();
  renderTenantAdmin();
  renderIntegrationBlueprint();
  renderSaasGate();
  hydrateFoundationControls();
  renderFoundationPlanner();
  renderPilotPack();
  renderDemoProofPack();
  renderValueProofPack();
  hydrateLaunchPartnerForm();
  renderLaunchPartnerPipeline();
  hydratePilotOpsForm();
  renderPilotOpsBoard();
  populateReplyItems();
  renderSupplierInbox();
  renderSupplierScorecard();
  render();
  setupHashNavigation();
}

function hydrateFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const query = (params.get("q") || "").trim();
  const category = (params.get("category") || "").trim();

  if (query) {
    state.query = query;
    els.search.value = query;
    els.finderSearch.value = query;
  }

  if (category && categories.includes(category)) {
    state.category = category;
    els.category.value = category;
  }
}

function populateFilters() {
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    els.category.append(option);
  });

  sourceTypes.forEach((sourceType) => {
    const option = document.createElement("option");
    option.value = sourceType;
    option.textContent = sourceType;
    els.sourceType.append(option);
  });
}

function populateQuoteProducts() {
  if (!els.quoteProduct) {
    return;
  }

  els.quoteProduct.innerHTML = "";
  products.forEach((product) => {
    const option = document.createElement("option");
    option.value = product.id;
    option.textContent = `${product.brand} ${product.sku} - ${product.name}`;
    els.quoteProduct.append(option);
  });
}

function populateCostProducts() {
  if (!els.costProduct) {
    return;
  }

  const currentValue = els.costProduct.value || state.landedCost.productId;
  els.costProduct.innerHTML = "";
  products.forEach((product) => {
    const option = document.createElement("option");
    option.value = product.id;
    option.textContent = `${product.brand} ${product.sku} - ${product.name}`;
    els.costProduct.append(option);
  });

  const productId = currentValue && products.some((product) => product.id === currentValue)
    ? currentValue
    : state.shortlist[0] || state.compare[0] || products[0]?.id || "";
  if (productId) {
    els.costProduct.value = productId;
    state.landedCost.productId = productId;
  }
}

function populateCostQuotes() {
  if (!els.costQuote) {
    return;
  }

  const currentValue = els.costQuote.value || state.landedCost.quoteId || "";
  els.costQuote.innerHTML = "";
  const manualOption = document.createElement("option");
  manualOption.value = "";
  manualOption.textContent = "Manual estimate / no saved quote";
  els.costQuote.append(manualOption);

  state.quotes.forEach((quote) => {
    const option = document.createElement("option");
    option.value = quote.id;
    option.textContent = `${quote.supplier} - ${quote.brand} ${quote.sku} - ${quote.currency} ${quote.unitPrice || "price TBC"}`;
    els.costQuote.append(option);
  });

  const quoteId = currentValue && state.quotes.some((quote) => quote.id === currentValue) ? currentValue : "";
  els.costQuote.value = quoteId;
  state.landedCost.quoteId = quoteId;
}

function populateNegotiationProducts() {
  if (!els.negotiationProduct) {
    return;
  }

  const currentValue = els.negotiationProduct.value || state.negotiationPlan.productId;
  els.negotiationProduct.innerHTML = "";
  products.forEach((product) => {
    const option = document.createElement("option");
    option.value = product.id;
    option.textContent = `${product.brand} ${product.sku} - ${product.name}`;
    els.negotiationProduct.append(option);
  });

  const productId = currentValue && products.some((product) => product.id === currentValue)
    ? currentValue
    : state.shortlist[0] || state.compare[0] || products[0]?.id || "";
  if (productId) {
    els.negotiationProduct.value = productId;
    state.negotiationPlan.productId = productId;
  }
}

function populateNegotiationQuotes() {
  if (!els.negotiationQuote) {
    return;
  }

  const currentValue = els.negotiationQuote.value || state.negotiationPlan.quoteId || "";
  els.negotiationQuote.innerHTML = "";
  const manualOption = document.createElement("option");
  manualOption.value = "";
  manualOption.textContent = "Manual negotiation / no saved quote";
  els.negotiationQuote.append(manualOption);

  state.quotes.forEach((quote) => {
    const option = document.createElement("option");
    option.value = quote.id;
    option.textContent = `${quote.supplier} - ${quote.brand} ${quote.sku} - ${quote.currency} ${quote.unitPrice || "price TBC"}`;
    els.negotiationQuote.append(option);
  });

  const quoteId = currentValue && state.quotes.some((quote) => quote.id === currentValue) ? currentValue : "";
  els.negotiationQuote.value = quoteId;
  state.negotiationPlan.quoteId = quoteId;
}

function populateSavingsProducts() {
  if (!els.savingsProduct) {
    return;
  }

  const currentValue = els.savingsProduct.value;
  els.savingsProduct.innerHTML = "";
  products.forEach((product) => {
    const option = document.createElement("option");
    option.value = product.id;
    option.textContent = `${product.brand} ${product.sku} - ${product.name}`;
    els.savingsProduct.append(option);
  });

  const productId = currentValue && products.some((product) => product.id === currentValue)
    ? currentValue
    : state.shortlist[0] || state.compare[0] || products[0]?.id || "";
  if (productId) {
    els.savingsProduct.value = productId;
  }
}

function populateSavingsQuotes() {
  if (!els.savingsQuote) {
    return;
  }

  const currentValue = els.savingsQuote.value || "";
  els.savingsQuote.innerHTML = "";
  const manualOption = document.createElement("option");
  manualOption.value = "";
  manualOption.textContent = "Manual savings record / no saved quote";
  els.savingsQuote.append(manualOption);

  state.quotes.forEach((quote) => {
    const option = document.createElement("option");
    option.value = quote.id;
    option.textContent = `${quote.supplier} - ${quote.brand} ${quote.sku} - ${quote.currency} ${quote.unitPrice || "price TBC"}`;
    els.savingsQuote.append(option);
  });

  els.savingsQuote.value = currentValue && state.quotes.some((quote) => quote.id === currentValue) ? currentValue : "";
}

function populateAlternateProducts() {
  if (!els.alternateProduct) {
    return;
  }

  const currentValue = els.alternateProduct.value || state.alternateReview.productId;
  els.alternateProduct.innerHTML = "";
  products.forEach((product) => {
    const option = document.createElement("option");
    option.value = product.id;
    option.textContent = `${product.brand} ${product.sku} - ${product.name}`;
    els.alternateProduct.append(option);
  });

  const preferred = currentValue && products.some((product) => product.id === currentValue)
    ? currentValue
    : state.shortlist[0] || state.compare[0] || products[0]?.id || "";
  if (preferred) {
    els.alternateProduct.value = preferred;
    state.alternateReview.productId = preferred;
  }
}

function populateApprovalProducts() {
  if (!els.approvalBase || !els.approvalCandidate) {
    return;
  }

  const currentBase = els.approvalBase.value || state.substitutionApproval.baseProductId;
  const currentCandidate = els.approvalCandidate.value || state.substitutionApproval.candidateProductId;
  els.approvalBase.innerHTML = "";
  els.approvalCandidate.innerHTML = "";
  products.forEach((product) => {
    const label = `${product.brand} ${product.sku} - ${product.name}`;
    const baseOption = document.createElement("option");
    baseOption.value = product.id;
    baseOption.textContent = label;
    els.approvalBase.append(baseOption);

    const candidateOption = document.createElement("option");
    candidateOption.value = product.id;
    candidateOption.textContent = label;
    els.approvalCandidate.append(candidateOption);
  });

  const baseId = currentBase && products.some((product) => product.id === currentBase)
    ? currentBase
    : state.alternateReview.productId || state.shortlist[0] || products[0]?.id || "";
  if (baseId) {
    els.approvalBase.value = baseId;
  }

  const candidateId = currentCandidate && products.some((product) => product.id === currentCandidate)
    ? currentCandidate
    : suggestedApprovalCandidateId(baseId);
  if (candidateId) {
    els.approvalCandidate.value = candidateId;
  }
}

function populateReplyItems() {
  if (!els.replyQuote) {
    return;
  }

  const currentValue = els.replyQuote.value;
  els.replyQuote.innerHTML = "";

  const quoteGroup = document.createElement("optgroup");
  quoteGroup.label = "Saved quotes";
  state.quotes.forEach((quote) => {
    const option = document.createElement("option");
    option.value = `quote:${quote.id}`;
    option.textContent = `${quote.supplier} - ${quote.brand} ${quote.sku}`;
    quoteGroup.append(option);
  });

  const productGroup = document.createElement("optgroup");
  productGroup.label = "Catalog products";
  products.forEach((product) => {
    const option = document.createElement("option");
    option.value = `product:${product.id}`;
    option.textContent = `${product.brand} ${product.sku} - ${product.name}`;
    productGroup.append(option);
  });

  if (quoteGroup.children.length) {
    els.replyQuote.append(quoteGroup);
  }
  els.replyQuote.append(productGroup);

  if ([...els.replyQuote.querySelectorAll("option")].some((option) => option.value === currentValue)) {
    els.replyQuote.value = currentValue;
  }
}

function renderMetrics() {
  const sourceLinkCount = products.reduce((total, product) => total + product.sources.length, 0);
  setText(els.categoryCount, categoryTaxonomy.length || categories.length);
  setText(els.productCount, products.length);
  setText(els.sourceCount, sourceLinkCount);
}

function wireEvents() {
  document.querySelectorAll(".more-menu").forEach((menu) => {
    menu.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        menu.removeAttribute("open");
      }
    });
  });

  document.addEventListener("click", (event) => {
    document.querySelectorAll(".more-menu[open]").forEach((menu) => {
      if (!menu.contains(event.target)) {
        menu.removeAttribute("open");
      }
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      document.querySelectorAll(".more-menu[open]").forEach((menu) => menu.removeAttribute("open"));
    }
  });

  els.heroSearch.addEventListener("submit", (event) => {
    event.preventDefault();
    setQuery(els.search.value);
    document.querySelector("#finder").scrollIntoView({ behavior: "smooth", block: "start" });
    render();
  });

  els.search.addEventListener("input", (event) => {
    setQuery(event.target.value);
    render();
  });

  els.finderSearchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    setQuery(els.finderSearch.value);
    render();
  });

  els.finderSearch.addEventListener("input", (event) => {
    setQuery(event.target.value);
    render();
  });

  els.category.addEventListener("change", (event) => {
    state.category = event.target.value;
    render();
  });

  els.region.addEventListener("change", (event) => {
    state.region = event.target.value;
    render();
  });

  els.sourceType.addEventListener("change", (event) => {
    state.sourceType = event.target.value;
    render();
  });

  els.confidence.addEventListener("change", (event) => {
    state.confidence = event.target.value;
    render();
  });

  els.datasheetOnly.addEventListener("change", (event) => {
    state.datasheetOnly = event.target.checked;
    render();
  });

  els.verifiedOnly.addEventListener("change", (event) => {
    state.verifiedOnly = event.target.checked;
    render();
  });

  els.priorityButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.priority = button.dataset.priority;
      els.priorityButtons.forEach((item) => item.classList.toggle("active", item === button));
      render();
    });
  });

  els.reset.addEventListener("click", () => {
    applySession({
      filters: defaultFilters()
    });
    render();
  });

  els.results.addEventListener("click", (event) => {
    const requestButton = event.target.closest("[data-open-product-request]");
    const shortlistButton = event.target.closest("[data-add]");
    const compareButton = event.target.closest("[data-compare]");
    const detailButton = event.target.closest("[data-detail]");

    if (requestButton) {
      openProductRequestPanel();
      return;
    }

    if (shortlistButton) {
      toggleShortlist(shortlistButton.dataset.add);
    }

    if (compareButton) {
      toggleCompare(compareButton.dataset.compare);
    }

    if (detailButton) {
      openProductDetail(detailButton.dataset.detail);
    }
  });

  els.categoryGrid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-category-select]");
    if (!button) {
      return;
    }
    state.category = button.dataset.categorySelect;
    els.category.value = state.category;
    document.querySelector("#finder").scrollIntoView({ behavior: "smooth", block: "start" });
    render();
  });

  els.shortlistToggle.addEventListener("click", openShortlist);
  els.exportShortlist.addEventListener("click", openShortlist);
  els.openCompare.addEventListener("click", () => {
    document.querySelector("#compare").scrollIntoView({ behavior: "smooth", block: "start" });
  });
  els.clearCompare.addEventListener("click", () => {
    state.compare = [];
    renderCompare();
    render();
  });
  els.copyCompare.addEventListener("click", copyCompare);
  els.compareGrid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove-compare]");
    if (button) {
      toggleCompare(button.dataset.removeCompare);
    }
  });
  specRequirementInputs().forEach((input) => {
    input.addEventListener("input", updateSpecRequirementsFromFields);
    input.addEventListener("change", updateSpecRequirementsFromFields);
  });
  if (els.saveSpecRequirements) {
    els.saveSpecRequirements.addEventListener("click", saveSpecRequirementsFromFields);
  }
  if (els.resetSpecRequirements) {
    els.resetSpecRequirements.addEventListener("click", resetSpecRequirements);
  }
  if (els.copySpecMatrix) {
    els.copySpecMatrix.addEventListener("click", copySpecMatrix);
  }
  if (els.downloadSpecMatrix) {
    els.downloadSpecMatrix.addEventListener("click", downloadSpecMatrixHtml);
  }
  if (els.exportSpecMatrixJson) {
    els.exportSpecMatrixJson.addEventListener("click", exportSpecMatrixJson);
  }
  alternateReviewInputs().forEach((input) => {
    input.addEventListener("input", updateAlternateReviewFromFields);
    input.addEventListener("change", updateAlternateReviewFromFields);
  });
  if (els.saveAlternateDesk) {
    els.saveAlternateDesk.addEventListener("click", saveAlternateReviewFromFields);
  }
  if (els.resetAlternateDesk) {
    els.resetAlternateDesk.addEventListener("click", resetAlternateReview);
  }
  if (els.copyAlternateReview) {
    els.copyAlternateReview.addEventListener("click", copyAlternateReview);
  }
  if (els.downloadAlternateReview) {
    els.downloadAlternateReview.addEventListener("click", downloadAlternateReviewHtml);
  }
  if (els.exportAlternateJson) {
    els.exportAlternateJson.addEventListener("click", exportAlternateReviewJson);
  }
  substitutionApprovalInputs().forEach((input) => {
    input.addEventListener("input", updateSubstitutionApprovalFromFields);
    input.addEventListener("change", updateSubstitutionApprovalFromFields);
  });
  if (els.approvalBase) {
    els.approvalBase.addEventListener("change", syncApprovalCandidateToBase);
  }
  if (els.saveApprovalPack) {
    els.saveApprovalPack.addEventListener("click", saveSubstitutionApprovalFromFields);
  }
  if (els.resetApprovalPack) {
    els.resetApprovalPack.addEventListener("click", resetSubstitutionApproval);
  }
  if (els.copyApprovalPack) {
    els.copyApprovalPack.addEventListener("click", copySubstitutionApprovalPack);
  }
  if (els.downloadApprovalPack) {
    els.downloadApprovalPack.addEventListener("click", downloadSubstitutionApprovalHtml);
  }
  if (els.exportApprovalJson) {
    els.exportApprovalJson.addEventListener("click", exportSubstitutionApprovalJson);
  }
  if (els.saveQuote) {
    els.saveQuote.addEventListener("click", saveQuoteFromForm);
  }
  if (els.quoteProduct) {
    els.quoteProduct.addEventListener("change", prefillQuoteFromProduct);
  }
  if (els.clearQuote) {
    els.clearQuote.addEventListener("click", clearQuoteForm);
  }
  if (els.copyQuoteSummary) {
    els.copyQuoteSummary.addEventListener("click", copyQuoteSummary);
  }
  if (els.copyQuoteFollowup) {
    els.copyQuoteFollowup.addEventListener("click", copyQuoteFollowupFromForm);
  }
  if (els.exportQuoteCsv) {
    els.exportQuoteCsv.addEventListener("click", exportQuoteCsv);
  }
  if (els.exportQuoteXlsx) {
    els.exportQuoteXlsx.addEventListener("click", exportQuoteXlsx);
  }
  if (els.clearQuotes) {
    els.clearQuotes.addEventListener("click", clearQuoteRecords);
  }
  landedCostInputs().forEach((input) => {
    input.addEventListener("input", updateLandedCostFromFields);
    input.addEventListener("change", updateLandedCostFromFields);
  });
  if (els.costQuote) {
    els.costQuote.addEventListener("change", applyCostQuoteSelection);
  }
  if (els.saveCostScenario) {
    els.saveCostScenario.addEventListener("click", saveLandedCostFromFields);
  }
  if (els.resetCostScenario) {
    els.resetCostScenario.addEventListener("click", resetLandedCostScenario);
  }
  if (els.copyCostBrief) {
    els.copyCostBrief.addEventListener("click", copyLandedCostBrief);
  }
  if (els.downloadCostHtml) {
    els.downloadCostHtml.addEventListener("click", downloadLandedCostHtml);
  }
  if (els.exportCostJson) {
    els.exportCostJson.addEventListener("click", exportLandedCostJson);
  }
  negotiationInputs().forEach((input) => {
    input.addEventListener("input", updateNegotiationFromFields);
    input.addEventListener("change", updateNegotiationFromFields);
  });
  if (els.negotiationQuote) {
    els.negotiationQuote.addEventListener("change", applyNegotiationQuoteSelection);
  }
  if (els.saveNegotiationPlan) {
    els.saveNegotiationPlan.addEventListener("click", saveNegotiationFromFields);
  }
  if (els.resetNegotiationPlan) {
    els.resetNegotiationPlan.addEventListener("click", resetNegotiationPlan);
  }
  if (els.copyNegotiationEmail) {
    els.copyNegotiationEmail.addEventListener("click", copyNegotiationEmail);
  }
  if (els.copySavingsNote) {
    els.copySavingsNote.addEventListener("click", copyNegotiationSavingsNote);
  }
  if (els.downloadNegotiationHtml) {
    els.downloadNegotiationHtml.addEventListener("click", downloadNegotiationHtml);
  }
  if (els.exportNegotiationJson) {
    els.exportNegotiationJson.addEventListener("click", exportNegotiationJson);
  }
  if (els.savingsQuote) {
    els.savingsQuote.addEventListener("change", prefillSavingsFromQuote);
  }
  if (els.useNegotiationPlan) {
    els.useNegotiationPlan.addEventListener("click", useNegotiationPlanForSavings);
  }
  if (els.saveSavingsRecord) {
    els.saveSavingsRecord.addEventListener("click", saveSavingsRecordFromForm);
  }
  if (els.clearSavingsForm) {
    els.clearSavingsForm.addEventListener("click", clearSavingsForm);
  }
  if (els.copySavingsRegister) {
    els.copySavingsRegister.addEventListener("click", copySavingsRegisterReport);
  }
  if (els.exportSavingsCsv) {
    els.exportSavingsCsv.addEventListener("click", exportSavingsCsv);
  }
  if (els.exportSavingsJson) {
    els.exportSavingsJson.addEventListener("click", exportSavingsJson);
  }
  if (els.clearSavingsRecords) {
    els.clearSavingsRecords.addEventListener("click", clearSavingsRecords);
  }
  if (els.savingsList) {
    els.savingsList.addEventListener("click", (event) => {
      const loadButton = event.target.closest("[data-load-savings]");
      const copyButton = event.target.closest("[data-copy-savings]");
      const removeButton = event.target.closest("[data-remove-savings]");

      if (loadButton) {
        loadSavingsRecordToForm(loadButton.dataset.loadSavings);
      }

      if (copyButton) {
        copySingleSavingsRecord(copyButton.dataset.copySavings, copyButton);
      }

      if (removeButton) {
        removeSavingsRecord(removeButton.dataset.removeSavings);
      }
    });
  }
  if (els.learningProduct) {
    els.learningProduct.addEventListener("change", prefillLearningSupplier);
  }
  if (els.saveLearningRecord) {
    els.saveLearningRecord.addEventListener("click", saveLearningRecordFromForm);
  }
  if (els.prefillLearningFromDecision) {
    els.prefillLearningFromDecision.addEventListener("click", prefillLearningFromDecision);
  }
  if (els.clearLearningForm) {
    els.clearLearningForm.addEventListener("click", clearLearningForm);
  }
  if (els.copyLearningReport) {
    els.copyLearningReport.addEventListener("click", copyLearningReport);
  }
  if (els.exportLearningCsv) {
    els.exportLearningCsv.addEventListener("click", exportLearningCsv);
  }
  if (els.exportLearningJson) {
    els.exportLearningJson.addEventListener("click", exportLearningJson);
  }
  if (els.clearLearningRecords) {
    els.clearLearningRecords.addEventListener("click", clearLearningRecords);
  }
  if (els.learningList) {
    els.learningList.addEventListener("click", (event) => {
      const loadButton = event.target.closest("[data-load-learning]");
      const copyButton = event.target.closest("[data-copy-learning]");
      const removeButton = event.target.closest("[data-remove-learning]");

      if (loadButton) {
        loadLearningRecordToForm(loadButton.dataset.loadLearning);
      }

      if (copyButton) {
        copySingleLearningRecord(copyButton.dataset.copyLearning, copyButton);
      }

      if (removeButton) {
        removeLearningRecord(removeButton.dataset.removeLearning);
      }
    });
  }
  playbookControlInputs().forEach((input) => {
    input.addEventListener("change", () => {
      state.playbookConfig = playbookConfigFromFields();
      savePlaybookConfig();
      renderPlaybookLab();
    });
  });
  if (els.promotePlaybookRule) {
    els.promotePlaybookRule.addEventListener("click", () => promotePlaybookRule());
  }
  if (els.copyPlaybookBrief) {
    els.copyPlaybookBrief.addEventListener("click", copyPlaybookBrief);
  }
  if (els.exportPlaybookJson) {
    els.exportPlaybookJson.addEventListener("click", exportPlaybookJson);
  }
  if (els.clearPlaybookRules) {
    els.clearPlaybookRules.addEventListener("click", clearPlaybookRules);
  }
  if (els.playbookRecommendations) {
    els.playbookRecommendations.addEventListener("click", (event) => {
      const promoteButton = event.target.closest("[data-promote-playbook]");
      const copyButton = event.target.closest("[data-copy-playbook-rec]");

      if (promoteButton) {
        promotePlaybookRule(promoteButton.dataset.promotePlaybook, promoteButton);
      }

      if (copyButton) {
        copyPlaybookRecommendation(copyButton.dataset.copyPlaybookRec, copyButton);
      }
    });
  }
  if (els.playbookList) {
    els.playbookList.addEventListener("click", (event) => {
      const copyButton = event.target.closest("[data-copy-playbook-rule]");
      const removeButton = event.target.closest("[data-remove-playbook-rule]");

      if (copyButton) {
        copySavedPlaybookRule(copyButton.dataset.copyPlaybookRule, copyButton);
      }

      if (removeButton) {
        removePlaybookRule(removeButton.dataset.removePlaybookRule);
      }
    });
  }
  if (els.signalProduct) {
    els.signalProduct.addEventListener("change", hydrateSignalFromSelectedProduct);
  }
  if (els.saveSignalRecord) {
    els.saveSignalRecord.addEventListener("click", saveSignalRecordFromForm);
  }
  if (els.prefillSignalContext) {
    els.prefillSignalContext.addEventListener("click", prefillSignalFromContext);
  }
  if (els.clearSignalForm) {
    els.clearSignalForm.addEventListener("click", clearSignalForm);
  }
  if (els.copySignalReport) {
    els.copySignalReport.addEventListener("click", copySignalReport);
  }
  if (els.exportSignalCsv) {
    els.exportSignalCsv.addEventListener("click", exportSignalCsv);
  }
  if (els.exportSignalJson) {
    els.exportSignalJson.addEventListener("click", exportSignalJson);
  }
  if (els.clearSignalRecords) {
    els.clearSignalRecords.addEventListener("click", clearSignalRecords);
  }
  if (els.signalList) {
    els.signalList.addEventListener("click", (event) => {
      const loadButton = event.target.closest("[data-load-signal]");
      const copyButton = event.target.closest("[data-copy-signal]");
      const removeButton = event.target.closest("[data-remove-signal]");

      if (loadButton) {
        loadSignalRecordToForm(loadButton.dataset.loadSignal);
      }

      if (copyButton) {
        copySingleSignalRecord(copyButton.dataset.copySignal, copyButton);
      }

      if (removeButton) {
        removeSignalRecord(removeButton.dataset.removeSignal);
      }
    });
  }
  governanceControlInputs().forEach((input) => {
    input.addEventListener("change", () => {
      state.governancePolicy = governancePolicyFromFields();
      saveGovernancePolicy();
      renderGovernanceCenter();
      renderLearningQueue();
      renderAiLoop();
      renderTenantAdmin();
      renderIntegrationBlueprint();
      renderSaasGate();
      renderFoundationPlanner();
      renderPilotPack();
      renderDemoProofPack();
      renderValueProofPack();
    });
  });
  if (els.copyGovernanceBrief) {
    els.copyGovernanceBrief.addEventListener("click", copyGovernanceBrief);
  }
  if (els.exportGovernanceJson) {
    els.exportGovernanceJson.addEventListener("click", exportGovernanceJson);
  }
  [els.learningQueueFilter, els.learningQueueRisk].filter(Boolean).forEach((input) => {
    input.addEventListener("change", renderLearningQueue);
  });
  if (els.approveSafeLearning) {
    els.approveSafeLearning.addEventListener("click", approveSafeLearningCandidates);
  }
  if (els.copyLearningQueue) {
    els.copyLearningQueue.addEventListener("click", copyLearningQueueBrief);
  }
  if (els.exportLearningQueueJson) {
    els.exportLearningQueueJson.addEventListener("click", exportLearningQueueJson);
  }
  if (els.copyAiLoopBrief) {
    els.copyAiLoopBrief.addEventListener("click", copyAiLoopBrief);
  }
  if (els.exportAiLoopJson) {
    els.exportAiLoopJson.addEventListener("click", exportAiLoopJson);
  }
  if (els.copyTenantAdminBrief) {
    els.copyTenantAdminBrief.addEventListener("click", copyTenantAdminBrief);
  }
  if (els.exportTenantAdminJson) {
    els.exportTenantAdminJson.addEventListener("click", exportTenantAdminJson);
  }
  if (els.copyIntegrationBrief) {
    els.copyIntegrationBrief.addEventListener("click", copyIntegrationBrief);
  }
  if (els.exportIntegrationJson) {
    els.exportIntegrationJson.addEventListener("click", exportIntegrationJson);
  }
  if (els.copySaasGateBrief) {
    els.copySaasGateBrief.addEventListener("click", copySaasGateBrief);
  }
  if (els.exportSaasGateJson) {
    els.exportSaasGateJson.addEventListener("click", exportSaasGateJson);
  }
  foundationControlInputs().forEach((input) => {
    input.addEventListener("change", () => {
      state.backendFoundation = foundationPlanFromFields();
      saveBackendFoundation();
      renderFoundationPlanner();
    });
  });
  if (els.foundationOwner) {
    els.foundationOwner.addEventListener("input", () => {
      state.backendFoundation = foundationPlanFromFields();
      saveBackendFoundation();
      renderFoundationPlanner();
    });
  }
  if (els.foundationTargetDate) {
    els.foundationTargetDate.addEventListener("change", () => {
      state.backendFoundation = foundationPlanFromFields();
      saveBackendFoundation();
      renderFoundationPlanner();
    });
  }
  if (els.foundationNotes) {
    els.foundationNotes.addEventListener("input", () => {
      state.backendFoundation = foundationPlanFromFields();
      saveBackendFoundation();
      renderFoundationPlanner();
    });
  }
  if (els.saveFoundationPlan) {
    els.saveFoundationPlan.addEventListener("click", saveFoundationPlanFromForm);
  }
  if (els.copyFoundationBrief) {
    els.copyFoundationBrief.addEventListener("click", copyFoundationBrief);
  }
  if (els.exportFoundationJson) {
    els.exportFoundationJson.addEventListener("click", exportFoundationJson);
  }
  if (els.resetFoundationPlan) {
    els.resetFoundationPlan.addEventListener("click", resetFoundationPlan);
  }
  if (els.copyPilotPackBrief) {
    els.copyPilotPackBrief.addEventListener("click", copyPilotPackBrief);
  }
  if (els.exportPilotPackJson) {
    els.exportPilotPackJson.addEventListener("click", exportPilotPackJson);
  }
  if (els.copyDemoProofBrief) {
    els.copyDemoProofBrief.addEventListener("click", copyDemoProofBrief);
  }
  if (els.exportDemoProofJson) {
    els.exportDemoProofJson.addEventListener("click", exportDemoProofJson);
  }
  if (els.copyValueProofBrief) {
    els.copyValueProofBrief.addEventListener("click", copyValueProofBrief);
  }
  if (els.exportValueProofJson) {
    els.exportValueProofJson.addEventListener("click", exportValueProofJson);
  }
  if (els.savePartner) {
    els.savePartner.addEventListener("click", saveLaunchPartnerFromForm);
  }
  if (els.copyPartnerOutreach) {
    els.copyPartnerOutreach.addEventListener("click", copyLaunchPartnerOutreach);
  }
  if (els.clearPartnerForm) {
    els.clearPartnerForm.addEventListener("click", () => hydrateLaunchPartnerForm());
  }
  if (els.copyPartnerReport) {
    els.copyPartnerReport.addEventListener("click", copyLaunchPartnerReport);
  }
  if (els.exportPartnerCsv) {
    els.exportPartnerCsv.addEventListener("click", exportLaunchPartnerCsv);
  }
  if (els.exportPartnerJson) {
    els.exportPartnerJson.addEventListener("click", exportLaunchPartnerJson);
  }
  if (els.clearPartners) {
    els.clearPartners.addEventListener("click", clearLaunchPartners);
  }
  if (els.partnerList) {
    els.partnerList.addEventListener("click", (event) => {
      const loadButton = event.target.closest("[data-load-partner]");
      const copyButton = event.target.closest("[data-copy-partner]");
      const removeButton = event.target.closest("[data-remove-partner]");

      if (loadButton) {
        loadLaunchPartnerToForm(loadButton.dataset.loadPartner);
      }

      if (copyButton) {
        copySavedLaunchPartnerOutreach(copyButton.dataset.copyPartner, copyButton);
      }

      if (removeButton) {
        removeLaunchPartner(removeButton.dataset.removePartner);
      }
    });
  }
  if (els.savePilotOps) {
    els.savePilotOps.addEventListener("click", savePilotRunFromForm);
  }
  if (els.copyPilotOpsBrief) {
    els.copyPilotOpsBrief.addEventListener("click", copyPilotRunBrief);
  }
  if (els.clearPilotOpsForm) {
    els.clearPilotOpsForm.addEventListener("click", () => hydratePilotOpsForm());
  }
  if (els.copyPilotOpsReport) {
    els.copyPilotOpsReport.addEventListener("click", copyPilotOpsReport);
  }
  if (els.exportPilotOpsCsv) {
    els.exportPilotOpsCsv.addEventListener("click", exportPilotOpsCsv);
  }
  if (els.exportPilotOpsJson) {
    els.exportPilotOpsJson.addEventListener("click", exportPilotOpsJson);
  }
  if (els.clearPilotOps) {
    els.clearPilotOps.addEventListener("click", clearPilotRuns);
  }
  if (els.pilotOpsList) {
    els.pilotOpsList.addEventListener("click", (event) => {
      const loadButton = event.target.closest("[data-load-pilot-run]");
      const copyButton = event.target.closest("[data-copy-pilot-run]");
      const removeButton = event.target.closest("[data-remove-pilot-run]");

      if (loadButton) {
        loadPilotRunToForm(loadButton.dataset.loadPilotRun);
      }

      if (copyButton) {
        copySavedPilotRunBrief(copyButton.dataset.copyPilotRun, copyButton);
      }

      if (removeButton) {
        removePilotRun(removeButton.dataset.removePilotRun);
      }
    });
  }
  if (els.learningQueueList) {
    els.learningQueueList.addEventListener("click", (event) => {
      const actionButton = event.target.closest("[data-learning-queue-action]");
      const copyButton = event.target.closest("[data-copy-learning-candidate]");

      if (actionButton) {
        setLearningCandidateStatus(actionButton.dataset.learningQueueAction, actionButton.dataset.candidateId);
      }

      if (copyButton) {
        copyLearningCandidate(copyButton.dataset.copyLearningCandidate, copyButton);
      }
    });
  }
  if (els.quoteList) {
    els.quoteList.addEventListener("click", (event) => {
      const loadButton = event.target.closest("[data-load-quote]");
      const copyButton = event.target.closest("[data-copy-quote-followup]");
      const removeButton = event.target.closest("[data-remove-quote]");

      if (loadButton) {
        loadQuoteToForm(loadButton.dataset.loadQuote);
      }

      if (copyButton) {
        copyQuoteFollowup(copyButton.dataset.copyQuoteFollowup, copyButton);
      }

      if (removeButton) {
        removeQuoteRecord(removeButton.dataset.removeQuote);
      }
    });
  }
  if (els.replyQuote) {
    els.replyQuote.addEventListener("change", prefillReplyFromContext);
  }
  if (els.replyStatus) {
    els.replyStatus.addEventListener("change", () => {
      if (els.replyAction) {
        els.replyAction.value = defaultReplyAction(els.replyStatus.value);
      }
    });
  }
  if (els.saveReply) {
    els.saveReply.addEventListener("click", saveSupplierReply);
  }
  if (els.clearReply) {
    els.clearReply.addEventListener("click", clearSupplierReplyForm);
  }
  if (els.copyBuyerReply) {
    els.copyBuyerReply.addEventListener("click", copyBuyerReplyFromForm);
  }
  if (els.convertReplyQuote) {
    els.convertReplyQuote.addEventListener("click", () => convertReplyToQuote(replyFormSnapshot(), els.convertReplyQuote));
  }
  if (els.exportReplyCsv) {
    els.exportReplyCsv.addEventListener("click", exportSupplierReplyCsv);
  }
  if (els.exportReplyXlsx) {
    els.exportReplyXlsx.addEventListener("click", exportSupplierReplyXlsx);
  }
  if (els.clearReplies) {
    els.clearReplies.addEventListener("click", clearSupplierReplies);
  }
  if (els.copySupplierScorecard) {
    els.copySupplierScorecard.addEventListener("click", copySupplierScorecard);
  }
  if (els.downloadSupplierScorecard) {
    els.downloadSupplierScorecard.addEventListener("click", downloadSupplierScorecardHtml);
  }
  if (els.exportSupplierScorecardJson) {
    els.exportSupplierScorecardJson.addEventListener("click", exportSupplierScorecardJson);
  }
  if (els.replyList) {
    els.replyList.addEventListener("click", (event) => {
      const loadButton = event.target.closest("[data-load-reply]");
      const copyButton = event.target.closest("[data-copy-buyer-reply]");
      const convertButton = event.target.closest("[data-convert-reply]");
      const removeButton = event.target.closest("[data-remove-reply]");

      if (loadButton) {
        loadSupplierReply(loadButton.dataset.loadReply);
      }

      if (copyButton) {
        copyBuyerReply(copyButton.dataset.copyBuyerReply, copyButton);
      }

      if (convertButton) {
        convertReplyToQuote(convertButton.dataset.convertReply, convertButton);
      }

      if (removeButton) {
        removeSupplierReply(removeButton.dataset.removeReply);
      }
    });
  }
  els.closeShortlist.addEventListener("click", closeShortlist);
  els.closeProductDetail.addEventListener("click", closeProductDetail);
  els.scrim.addEventListener("click", closeOverlays);
  els.productDetailContent.addEventListener("click", (event) => {
    const copyButton = event.target.closest("[data-copy-rfq]");
    const supplierButton = event.target.closest("[data-copy-supplier]");
    const updateButton = event.target.closest("[data-copy-update]");
    const briefButton = event.target.closest("[data-copy-brief]");
    const sourcePassportButton = event.target.closest("[data-copy-source-passport]");
    const startQuoteButton = event.target.closest("[data-start-quote]");
    const shortlistButton = event.target.closest("[data-detail-add]");
    const compareButton = event.target.closest("[data-detail-compare]");

    if (copyButton) {
      copyProductRfq(copyButton.dataset.copyRfq);
    }

    if (supplierButton) {
      copySupplierOutreach(supplierButton.dataset.copySupplier, supplierButton);
    }

    if (briefButton) {
      copyProcurementBrief(briefButton.dataset.copyBrief, briefButton);
    }

    if (updateButton) {
      copyDataUpdate(updateButton.dataset.copyUpdate);
    }

    if (sourcePassportButton) {
      copySourcePassport(sourcePassportButton.dataset.sourceProduct, Number(sourcePassportButton.dataset.sourceIndex), sourcePassportButton);
    }

    if (startQuoteButton) {
      startQuoteForProduct(startQuoteButton.dataset.startQuote);
    }

    if (shortlistButton) {
      toggleShortlist(shortlistButton.dataset.detailAdd);
      openProductDetail(shortlistButton.dataset.detailAdd);
    }

    if (compareButton) {
      toggleCompare(compareButton.dataset.detailCompare);
      openProductDetail(compareButton.dataset.detailCompare);
    }
  });
  els.productDetailContent.addEventListener("input", (event) => {
    if (event.target.matches("[data-buyer-note]")) {
      state.notes[event.target.dataset.buyerNote] = event.target.value;
      saveNotes();
    }
  });
  els.clearShortlist.addEventListener("click", () => {
    state.shortlist = [];
    renderShortlist();
    render();
  });
  els.copyShortlist.addEventListener("click", copyShortlist);
  els.downloadRfqPack.addEventListener("click", downloadRfqPack);
  els.downloadShortlistXlsx.addEventListener("click", downloadShortlistXlsx);
  els.downloadShortlist.addEventListener("click", downloadShortlistCsv);
  els.saveSession.addEventListener("click", saveSession);
  els.loadSession.addEventListener("click", loadSession);
  els.exportSession.addEventListener("click", exportSessionFile);
  els.importSession.addEventListener("click", () => els.importSessionFile.click());
  els.importSessionFile.addEventListener("change", importSessionFile);
  projectInputs().forEach((input) => {
    input.addEventListener("input", updateProjectFromFields);
  });
  if (els.saveProject) {
    els.saveProject.addEventListener("click", saveProjectFromFields);
  }
  if (els.copyProjectBrief) {
    els.copyProjectBrief.addEventListener("click", copyProjectBrief);
  }
  if (els.copyPrivacyBrief) {
    els.copyPrivacyBrief.addEventListener("click", copyPrivacyBrief);
  }
  if (els.copyWorkspaceBrief) {
    els.copyWorkspaceBrief.addEventListener("click", copyWorkspaceBrief);
  }
  if (els.exportWorkspaceSnapshot) {
    els.exportWorkspaceSnapshot.addEventListener("click", exportWorkspaceSnapshot);
  }
  if (els.copyReviewBoard) {
    els.copyReviewBoard.addEventListener("click", copyReviewBoardReport);
  }
  if (els.exportReviewBoardJson) {
    els.exportReviewBoardJson.addEventListener("click", exportReviewBoardJson);
  }
  if (els.copyDecisionMemo) {
    els.copyDecisionMemo.addEventListener("click", copyDecisionMemo);
  }
  if (els.downloadDecisionMemo) {
    els.downloadDecisionMemo.addEventListener("click", downloadDecisionMemoHtml);
  }
  if (els.copyAwardHandover) {
    els.copyAwardHandover.addEventListener("click", copyAwardHandover);
  }
  if (els.copySupplierAwardEmail) {
    els.copySupplierAwardEmail.addEventListener("click", copySupplierAwardEmail);
  }
  if (els.downloadAwardHandover) {
    els.downloadAwardHandover.addEventListener("click", downloadAwardHandoverHtml);
  }
  if (els.copyCompliancePack) {
    els.copyCompliancePack.addEventListener("click", copyCompliancePack);
  }
  if (els.copySupplierDueDiligence) {
    els.copySupplierDueDiligence.addEventListener("click", copySupplierDueDiligenceEmail);
  }
  if (els.downloadCompliancePack) {
    els.downloadCompliancePack.addEventListener("click", downloadCompliancePackHtml);
  }
  if (els.copyBuyerFile) {
    els.copyBuyerFile.addEventListener("click", copyBuyerFileIndex);
  }
  if (els.downloadBuyerFileHtml) {
    els.downloadBuyerFileHtml.addEventListener("click", downloadBuyerFileHtml);
  }
  if (els.exportBuyerFileJson) {
    els.exportBuyerFileJson.addEventListener("click", exportBuyerFileJson);
  }
  if (els.clearProject) {
    els.clearProject.addEventListener("click", clearProjectProfile);
  }
  els.copyProductRequest.addEventListener("click", copyProductRequest);
  els.saveProductRequest.addEventListener("click", saveProductRequest);
  els.copyResearchBrief.addEventListener("click", copyResearchBrief);
  els.clearProductRequest.addEventListener("click", clearProductRequestForm);
  els.requestList.addEventListener("click", (event) => {
    const copyButton = event.target.closest("[data-copy-request]");
    const loadButton = event.target.closest("[data-load-request]");
    const removeButton = event.target.closest("[data-remove-request]");

    if (copyButton) {
      copySavedProductRequest(copyButton.dataset.copyRequest);
    }

    if (loadButton) {
      loadSavedProductRequest(loadButton.dataset.loadRequest);
    }

    if (removeButton) {
      removeSavedProductRequest(removeButton.dataset.removeRequest);
    }
  });
  els.sourceDirectory.addEventListener("click", (event) => {
    const button = event.target.closest("[data-copy-directory-passport]");
    if (button) {
      copyDirectorySourcePassport(button.dataset.copyDirectoryPassport, button);
    }
  });
  if (els.saveSourceLead) {
    els.saveSourceLead.addEventListener("click", saveSourceLead);
  }
  if (els.copySourceLead) {
    els.copySourceLead.addEventListener("click", copyCurrentSourceLead);
  }
  if (els.exportSourceLeadCsv) {
    els.exportSourceLeadCsv.addEventListener("click", exportSourceLeadCsv);
  }
  if (els.exportSourceLeadXlsx) {
    els.exportSourceLeadXlsx.addEventListener("click", exportSourceLeadXlsx);
  }
  if (els.clearSourceLead) {
    els.clearSourceLead.addEventListener("click", clearSourceLeadForm);
  }
  if (els.clearSourceLeads) {
    els.clearSourceLeads.addEventListener("click", clearSourceLeads);
  }
  if (els.sourceLeadList) {
    els.sourceLeadList.addEventListener("click", (event) => {
      const loadButton = event.target.closest("[data-load-source-lead]");
      const copyButton = event.target.closest("[data-copy-source-lead]");
      const removeButton = event.target.closest("[data-remove-source-lead]");

      if (loadButton) {
        loadSourceLead(loadButton.dataset.loadSourceLead);
      }

      if (copyButton) {
        copySavedSourceLead(copyButton.dataset.copySourceLead, copyButton);
      }

      if (removeButton) {
        removeSourceLead(removeButton.dataset.removeSourceLead);
      }
    });
  }
}

function setQuery(value) {
  const rawValue = String(value);
  state.query = rawValue.trim();

  if (document.activeElement !== els.search) {
    els.search.value = rawValue;
  }

  if (document.activeElement !== els.finderSearch) {
    els.finderSearch.value = rawValue;
  }
}

function render() {
  const matches = products
    .filter(matchesFilters)
    .sort((a, b) => b[state.priority] - a[state.priority]);

  renderBuyerWorkspace(matches);
  renderEvidenceReviewBoard();
  renderDecisionMemo();
  renderAwardHandover();
  renderComplianceGate();
  renderBuyerFile();
  renderSupplierScorecard();
  renderGovernanceCenter();
  renderLearningQueue();
  renderAiLoop();
  renderTenantAdmin();
  renderIntegrationBlueprint();
  renderSaasGate();
  renderFoundationPlanner();
  renderPilotPack();
  renderDemoProofPack();
  renderValueProofPack();
  renderLaunchPartnerPipeline();
  renderPilotOpsBoard();
  renderSpecMatchDesk(matches);
  renderAlternateDesk(matches);
  renderSubstitutionApprovalPack();
  updateShortlistControls();
  els.resultCount.textContent = `${matches.length} ${matches.length === 1 ? "product" : "products"}`;
  els.resultSummary.textContent = summaryText(matches.length);

  if (!matches.length) {
    els.results.innerHTML = `
      <div class="empty-state request-empty">
        <strong>No products match this search yet.</strong>
        <p>Try a broader keyword, source type, or region. If the item is still missing, create a product request so the exact part, sources, alternates, and datasheet path can be reviewed.</p>
        <button class="ghost-button" type="button" data-open-product-request>Open product request</button>
      </div>
    `;
    return;
  }

  els.results.innerHTML = matches.map(productTemplate).join("");
}

function setupHashNavigation() {
  window.addEventListener("hashchange", () => queueHashScroll({ smooth: true }));
  window.addEventListener("load", () => queueHashScroll());
  queueHashScroll();
}

function queueHashScroll(options = {}) {
  if (!window.location.hash || window.location.hash === "#") {
    return;
  }

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => scrollToCurrentHash(options));
  });
  [120, 360, 900, 1600].forEach((delay) => {
    window.setTimeout(() => scrollToCurrentHash(options), delay);
  });
}

function scrollToCurrentHash(options = {}) {
  if (!window.location.hash || window.location.hash === "#") {
    return;
  }

  let targetId = window.location.hash.slice(1);
  try {
    targetId = decodeURIComponent(targetId);
  } catch {
    // Keep the raw hash when decoding fails.
  }

  const target = document.getElementById(targetId);
  if (!target) {
    return;
  }

  target.scrollIntoView({
    behavior: options.smooth ? "smooth" : "auto",
    block: "start"
  });
}

function matchesFilters(product) {
  const haystack = [
    product.name,
    product.brand,
    product.sku,
    product.category,
    product.family,
    product.description,
    product.lifecycle,
    product.specs.join(" "),
    product.applications.join(" "),
    product.certifications.join(" "),
    product.alternatives.join(" "),
    product.sources.map((source) => `${source.name} ${source.type} ${source.region} ${source.action}`).join(" ")
  ]
    .join(" ")
    .toLowerCase();

  const queryTerms = state.query.toLowerCase().split(/\s+/).filter(Boolean);
  const queryMatch = queryTerms.every((term) => haystack.includes(term));
  const categoryMatch = state.category === "all" || product.category === state.category;
  const regionMatch = state.region === "all" || product.regions.includes(state.region);
  const sourceTypeMatch = state.sourceType === "all" || product.sources.some((source) => source.type === state.sourceType);
  const confidenceMatch = state.confidence === "all" || confidenceForProduct(product).level === state.confidence;
  const datasheetMatch = !state.datasheetOnly || product.datasheet;
  const verifiedMatch = !state.verifiedOnly || product.verified;

  return queryMatch && categoryMatch && regionMatch && sourceTypeMatch && confidenceMatch && datasheetMatch && verifiedMatch;
}

function summaryText(count) {
  if (!state.query && state.category === "all" && state.region === "all" && state.sourceType === "all" && state.confidence === "all") {
    return "Showing beta catalog records";
  }
  if (!count) {
    return "No match in current beta catalog";
  }
  if (state.query) {
    return `Best matches for "${state.query}"`;
  }
  return "Filtered procurement matches";
}

function renderBuyerWorkspace(matches = null) {
  if (!els.workspaceMetrics || !els.workspaceProjectFacts || !els.workspaceNextActions || !els.workspaceLanes) {
    return;
  }

  const currentMatches = matches || products.filter(matchesFilters);
  const shortlistedProducts = state.shortlist.map((id) => products.find((product) => product.id === id)).filter(Boolean);
  const followUpQuotes = state.quotes.filter((quote) => quote.status === "Follow-up needed").length;
  const replyActions = state.supplierReplies.filter(replyNeedsAction).length;
  const decision = quoteDecisionInsights();
  const readyScore = workspaceReadinessScore();
  const valueSummary = workspaceValueSummary();

  els.workspaceMetrics.innerHTML = [
    workspaceMetricTemplate("Readiness", `${readyScore}%`, "Local desk completion"),
    workspaceMetricTemplate("Shortlist", shortlistedProducts.length, "Products selected for RFQ"),
    workspaceMetricTemplate("Quotes", state.quotes.length, `${state.quotes.filter((quote) => ["Received", "Best option"].includes(quote.status)).length} received or preferred`),
    workspaceMetricTemplate("Follow-ups", followUpQuotes + replyActions, "Supplier actions to chase"),
    workspaceMetricTemplate("Growth Leads", state.productRequests.length + state.sourceLeads.length, "Missing items and sources")
  ].join("");

  els.workspaceProjectTitle.textContent = projectHasValue() ? projectValue("name", "Project RFQ workspace") : "No project context yet";
  els.workspaceProjectFacts.innerHTML = `
    <div><dt>Buyer</dt><dd>${escapeHtml(projectValue("buyer", "TBC"))}</dd></div>
    <div><dt>Delivery</dt><dd>${escapeHtml(projectValue("country", "TBC"))}</dd></div>
    <div><dt>Target</dt><dd>${escapeHtml(projectValue("targetDate", "TBC"))}</dd></div>
    <div><dt>Search result</dt><dd>${currentMatches.length} ${currentMatches.length === 1 ? "match" : "matches"}</dd></div>
    <div><dt>Compare</dt><dd>${state.compare.length} / 4 selected</dd></div>
    <div><dt>Value</dt><dd>${escapeHtml(valueSummary)}</dd></div>
  `;

  els.workspaceNextActions.innerHTML = workspaceNextActionItems(currentMatches)
    .map(
      (item) => `
        <div class="workspace-action-item">
          <span>${escapeHtml(item.stage)}</span>
          <strong>${escapeHtml(item.title)}</strong>
          <p>${escapeHtml(item.detail)}</p>
        </div>
      `
    )
    .join("");

  els.workspaceLanes.innerHTML = [
    workspaceLaneTemplate("Project", projectHasValue() ? "Context saved" : "Context needed", projectHasValue() ? projectValue("buyer", "Buyer ready") : "Add buyer, delivery country, target date, and project notes.", "#finder"),
    workspaceLaneTemplate("RFQ Pack", shortlistedProducts.length ? `${shortlistedProducts.length} item shortlist` : "Shortlist empty", shortlistedProducts.length ? "Ready to export RFQ pack, CSV, XLSX, or supplier-ready text." : "Add catalog matches before creating supplier outreach.", "#finder"),
    workspaceLaneTemplate("Quote Decision", decision.recommended ? `${decision.recommended.quote.supplier} leads` : "Awaiting quotes", decision.recommended ? `Current score ${decision.recommended.score}; review price, lead time, validity, and terms.` : "Record supplier prices and terms in the quote tracker.", "#quotes"),
    workspaceLaneTemplate("Supplier Inbox", state.supplierReplies.length ? `${state.supplierReplies.length} replies logged` : "No replies yet", replyActions ? `${replyActions} supplier ${replyActions === 1 ? "thread needs" : "threads need"} buyer action.` : "Capture replies, missing certificates, alternates, and buyer response notes.", "#inbox"),
    workspaceLaneTemplate("Catalog Gap", state.productRequests.length ? `${state.productRequests.length} saved requests` : "No gaps saved", state.productRequests.length ? "Use requests to expand the catalog and source missing items." : "Unknown parts can be turned into research requests from Finder.", "#finder"),
    workspaceLaneTemplate("Source Intake", state.sourceLeads.length ? `${state.sourceLeads.length} source leads` : "No source leads", state.sourceLeads.length ? "Review supplier evidence before adding source paths to the catalog." : "Capture new suppliers, distributor leads, and evidence links in Sources.", "#source-intake")
  ].join("");
}

function workspaceMetricTemplate(label, value, detail) {
  return `
    <article class="workspace-metric">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
      <small>${escapeHtml(detail)}</small>
    </article>
  `;
}

function workspaceLaneTemplate(stage, title, detail, href) {
  return `
    <article class="workspace-lane">
      <span>${escapeHtml(stage)}</span>
      <strong>${escapeHtml(title)}</strong>
      <p>${escapeHtml(detail)}</p>
      <a href="${escapeHtml(href)}">Open</a>
    </article>
  `;
}

function workspaceReadinessScore() {
  const checks = [
    projectHasValue(),
    state.shortlist.length > 0,
    state.compare.length > 0,
    state.quotes.length > 0,
    state.supplierReplies.length > 0 || state.productRequests.length > 0 || state.sourceLeads.length > 0 || Object.values(state.notes).some((note) => String(note || "").trim())
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

function workspaceValueSummary() {
  const totals = quoteTotalsByCurrency();
  const entries = Object.entries(totals);
  if (!entries.length) {
    return "Price TBC";
  }
  return entries.map(([currency, value]) => `${currency} ${formatAmount(value)}`).join(" | ");
}

function workspaceNextActionItems(matches) {
  const items = [];
  const decision = quoteDecisionInsights();
  const followUpQuotes = state.quotes.filter((quote) => quote.status === "Follow-up needed").length;
  const replyActions = state.supplierReplies.filter(replyNeedsAction).length;

  if (!projectHasValue()) {
    items.push({
      stage: "Setup",
      title: "Add project context",
      detail: "Fill project name, buyer, delivery country, target date, and notes so exports are buyer-ready."
    });
  }
  if (!state.shortlist.length) {
    items.push({
      stage: "Shortlist",
      title: "Select products for RFQ",
      detail: matches.length ? "Add the best catalog matches to shortlist before creating the RFQ pack." : "Broaden the search or create a missing-product request."
    });
  }
  if (state.shortlist.length && state.compare.length < Math.min(2, state.shortlist.length)) {
    items.push({
      stage: "Compare",
      title: "Compare technical options",
      detail: "Use Compare on shortlisted items to review lead time, MOQ, datasheet, certifications, and alternates."
    });
  }
  if (state.shortlist.length && !state.quotes.length) {
    items.push({
      stage: "Supplier outreach",
      title: "Send RFQs and track replies",
      detail: "Use product detail to copy supplier emails, then record replies in Quotes or Inbox."
    });
  }
  if (followUpQuotes || replyActions) {
    items.push({
      stage: "Follow-up",
      title: "Close supplier action items",
      detail: `${followUpQuotes + replyActions} ${followUpQuotes + replyActions === 1 ? "item needs" : "items need"} response, missing document review, or quote update.`
    });
  }
  if (decision.recommended) {
    items.push({
      stage: "Decision",
      title: "Review the current quote lead",
      detail: `${decision.recommended.quote.supplier} is leading at score ${decision.recommended.score}. Confirm exact part, warranty, origin, and delivery terms.`
    });
  }
  if (!state.productRequests.length && !matches.length) {
    items.push({
      stage: "Catalog gap",
      title: "Save a product request",
      detail: "Capture unknown part, brand, quantity, application, and target country for catalog expansion."
    });
  }
  if (!state.sourceLeads.length) {
    items.push({
      stage: "Source growth",
      title: "Add supplier source leads",
      detail: "Capture distributors, OEM paths, RFQ networks, surplus channels, or regional suppliers with evidence before catalog inclusion."
    });
  }
  if (!items.length) {
    items.push({
      stage: "Ready",
      title: "Workspace is ready for buyer review",
      detail: "Export the workspace JSON, RFQ pack, quote summary, or supplier follow-up text for internal review."
    });
  }

  return items.slice(0, 5);
}

async function copyWorkspaceBrief() {
  const text = workspaceBriefText();
  try {
    await navigator.clipboard.writeText(text);
    if (els.copyWorkspaceBrief) {
      els.copyWorkspaceBrief.textContent = "Workspace brief copied";
      setTimeout(() => {
        els.copyWorkspaceBrief.textContent = "Copy workspace brief";
      }, 1400);
    }
  } catch {
    window.prompt("Copy workspace brief", text);
  }
}

function exportWorkspaceSnapshot() {
  const snapshot = {
    ...createSessionSnapshot(),
    workspace: {
      readinessScore: workspaceReadinessScore(),
      shortlistCount: state.shortlist.length,
      compareCount: state.compare.length,
      quoteCount: state.quotes.length,
      supplierReplyCount: state.supplierReplies.length,
      productRequestCount: state.productRequests.length,
      sourceLeadCount: state.sourceLeads.length,
      estimatedValue: workspaceValueSummary(),
      nextActions: workspaceNextActionItems(products.filter(matchesFilters))
    }
  };
  const projectSlug = safeFilenamePart(projectValue("name", ""));
  downloadFile(
    projectSlug
      ? `InduScout-Workspace-${projectSlug}-${new Date().toISOString().slice(0, 10)}.json`
      : `InduScout-Workspace-${new Date().toISOString().slice(0, 10)}.json`,
    JSON.stringify(snapshot, null, 2),
    "application/json;charset=utf-8"
  );
  if (els.exportWorkspaceSnapshot) {
    els.exportWorkspaceSnapshot.textContent = "Workspace exported";
    setTimeout(() => {
      els.exportWorkspaceSnapshot.textContent = "Export workspace JSON";
    }, 1400);
  }
}

function workspaceBriefText() {
  const shortlistedProducts = state.shortlist.map((id) => products.find((product) => product.id === id)).filter(Boolean);
  const decision = quoteDecisionInsights();
  const nextActions = workspaceNextActionItems(products.filter(matchesFilters));
  const shortlistText = shortlistedProducts.length
    ? shortlistedProducts.map((product, index) => `${index + 1}. ${product.brand} ${product.sku} - ${product.name}`).join("\n")
    : "No shortlisted products yet.";
  const quoteText = state.quotes.length
    ? state.quotes
        .map((quote, index) => `${index + 1}. ${quote.supplier} - ${quote.brand} ${quote.sku} - ${quote.status} - ${quote.currency} ${quote.unitPrice || "TBC"} - ${quote.leadTime || "Lead TBC"}`)
        .join("\n")
    : "No quote records yet.";
  const sourceLeadText = state.sourceLeads.length
    ? state.sourceLeads
        .map((lead, index) => `${index + 1}. ${lead.name} - ${lead.type} - ${lead.category} - ${lead.region || "Region TBC"} - ${lead.status}`)
        .join("\n")
    : "No source leads saved yet.";

  return `InduScout buyer workspace brief

Project: ${projectValue("name", "TBC")}
Buyer/company: ${projectValue("buyer", "TBC")}
Buyer contact: ${projectValue("contact", "TBC")}
Delivery country: ${projectValue("country", "TBC")}
Target date: ${projectValue("targetDate", "TBC")}

Workspace readiness: ${workspaceReadinessScore()}%
Shortlist items: ${state.shortlist.length}
Compare items: ${state.compare.length}
Saved quote records: ${state.quotes.length}
Supplier inbox replies: ${state.supplierReplies.length}
Saved missing-product requests: ${state.productRequests.length}
Saved source leads: ${state.sourceLeads.length}
Estimated quoted value: ${workspaceValueSummary()}

Current decision signal:
${decision.recommended ? `${decision.recommended.quote.supplier} leads with score ${decision.recommended.score}.` : "No quote decision lead yet."}

Shortlisted products:
${shortlistText}

Quote register:
${quoteText}

Supplier/source intake:
${sourceLeadText}

Next buyer actions:
${nextActions.map((item, index) => `${index + 1}. ${item.title} - ${item.detail}`).join("\n")}

Project notes:
${projectValue("notes", "No project notes added.")}

InduScout is a discovery and RFQ preparation aid. Final purchase decisions should be confirmed with the OEM, authorized distributor, or supplier.`;
}

function renderEvidenceReviewBoard() {
  if (!els.reviewStats || !els.reviewQueueList || !els.reviewActionPlan) {
    return;
  }

  const items = evidenceReviewItems();
  const highCount = items.filter((item) => item.priority === "High").length;
  const sourceLeadCount = items.filter((item) => item.type === "Source lead").length;
  const catalogCount = items.filter((item) => item.type === "Catalog review").length;
  const commercialCount = items.filter((item) => ["Supplier reply", "Quote risk"].includes(item.type)).length;

  els.reviewStats.innerHTML = [
    reviewStatTemplate("Total review items", items.length, "Evidence and validation queue"),
    reviewStatTemplate("High priority", highCount, "Needs buyer or catalog attention"),
    reviewStatTemplate("Source leads", sourceLeadCount, "Supplier paths awaiting review"),
    reviewStatTemplate("Commercial risks", commercialCount, "Quote or reply flags")
  ].join("");

  if (!items.length) {
    els.reviewQueueList.innerHTML = `
      <div class="empty-state review-empty">
        No review items yet. Source leads, missing-product requests, supplier replies, quote flags, and review-level catalog records will appear here.
      </div>
    `;
  } else {
    els.reviewQueueList.innerHTML = items.slice(0, 12).map(reviewItemTemplate).join("");
  }

  const actions = evidenceActionPlan(items, { catalogCount, sourceLeadCount, commercialCount });
  els.reviewActionPlan.innerHTML = actions
    .map(
      (item) => `
        <div class="review-action-item">
          <span>${escapeHtml(item.stage)}</span>
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.detail)}</p>
        </div>
      `
    )
    .join("");

  renderDecisionMemo();
  renderAwardHandover();
}

function reviewStatTemplate(label, value, detail) {
  return `
    <article class="review-stat">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
      <small>${escapeHtml(detail)}</small>
    </article>
  `;
}

function reviewItemTemplate(item) {
  const priorityClass = item.priority.toLowerCase();
  return `
    <article class="review-item">
      <div>
        <span>${escapeHtml(item.type)}</span>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.detail)}</p>
      </div>
      <strong class="review-priority ${escapeHtml(priorityClass)}">${escapeHtml(item.priority)}</strong>
      <a href="${escapeHtml(item.href)}">${escapeHtml(item.action)}</a>
    </article>
  `;
}

function evidenceReviewItems() {
  const reviewProducts = products
    .filter((product) => confidenceForProduct(product).level === "review")
    .map((product) => ({
      type: "Catalog review",
      title: `${product.brand} ${product.sku}`,
      detail: `${product.name} needs stronger source, datasheet, alternate, or compatibility evidence before confidence can be raised.`,
      priority: "Medium",
      action: "Open in finder",
      href: `index.html?q=${encodeURIComponent(`${product.brand} ${product.sku}`)}#finder`,
      sort: 40
    }));

  const sourceLeadItems = state.sourceLeads.map((lead) => {
    const hasEvidence = Boolean(lead.website || lead.evidenceUrl);
    const priority = lead.status === "Authorized claim" ? "High" : hasEvidence ? "Medium" : "High";
    return {
      type: "Source lead",
      title: lead.name,
      detail: `${lead.type} for ${lead.category}. ${lead.region || "Region TBC"}. ${hasEvidence ? "Evidence link supplied." : "Evidence link missing."}`,
      priority,
      action: "Open supplier intake",
      href: "#source-intake",
      sort: priority === "High" ? 10 : 30
    };
  });

  const requestItems = state.productRequests.map((request) => ({
    type: "Missing product",
    title: request.part,
    detail: `${request.brand} | ${request.category} | ${request.country}. Needs exact part, source path, datasheet, alternates, lead time, and buying links.`,
    priority: request.urgency === "Urgent breakdown" ? "High" : "Medium",
    action: "Open product request",
    href: "#finder",
    sort: request.urgency === "Urgent breakdown" ? 12 : 35
  }));

  const supplierReplyItems = state.supplierReplies.filter(replyNeedsAction).map((reply) => ({
    type: "Supplier reply",
    title: `${reply.supplier} - ${reply.brand} ${reply.sku}`,
    detail: `${reply.status}. ${reply.nextAction}. Buyer should confirm certificates, alternates, price revision, or missing evidence.`,
    priority: ["Missing certificate", "Alternate offered"].includes(reply.status) ? "High" : "Medium",
    action: "Open inbox",
    href: "#inbox",
    sort: ["Missing certificate", "Alternate offered"].includes(reply.status) ? 14 : 32
  }));

  const quoteRiskItems = quoteDecisionInsights().scoredQuotes
    .filter((item) => item.flags.length)
    .map((item) => ({
      type: "Quote risk",
      title: `${item.quote.supplier} - ${item.quote.brand} ${item.quote.sku}`,
      detail: item.flags.slice(0, 3).join(", "),
      priority: item.flags.some((flag) => /expired|rejected|missing/i.test(flag)) ? "High" : "Medium",
      action: "Open quotes",
      href: "#quotes",
      sort: item.flags.some((flag) => /expired|rejected|missing/i.test(flag)) ? 16 : 34
    }));

  return [...sourceLeadItems, ...requestItems, ...supplierReplyItems, ...quoteRiskItems, ...reviewProducts]
    .sort((a, b) => a.sort - b.sort || a.title.localeCompare(b.title))
    .slice(0, 40);
}

function evidenceActionPlan(items, counts) {
  const actions = [];
  if (counts.sourceLeadCount) {
    actions.push({
      stage: "Source verification",
      title: "Review supplier/source evidence",
      detail: "Prioritize authorization claims and leads without evidence links before adding any new public source path."
    });
  }
  if (state.productRequests.length) {
    actions.push({
      stage: "Catalog expansion",
      title: "Convert missing-product requests into research tasks",
      detail: "Check exact part numbers, OEM pages, datasheets, distributors, alternates, and regional buying paths."
    });
  }
  if (counts.commercialCount) {
    actions.push({
      stage: "Commercial validation",
      title: "Close supplier reply and quote risks",
      detail: "Confirm certificates, alternates, validity, payment terms, delivery terms, warranty path, and seller legitimacy."
    });
  }
  if (counts.catalogCount) {
    actions.push({
      stage: "Catalog quality",
      title: "Strengthen review-level catalog records",
      detail: "Raise confidence only after source path, datasheet, lifecycle, certifications, and alternate notes are stronger."
    });
  }
  if (!actions.length) {
    actions.push({
      stage: "Ready",
      title: "Evidence queue is clear",
      detail: "New source leads, product gaps, supplier reply actions, and quote flags will appear here automatically."
    });
  }
  return actions.slice(0, 5);
}

async function copyReviewBoardReport() {
  const text = reviewBoardReportText();
  try {
    await navigator.clipboard.writeText(text);
    if (els.copyReviewBoard) {
      els.copyReviewBoard.textContent = "Review report copied";
      setTimeout(() => {
        els.copyReviewBoard.textContent = "Copy review report";
      }, 1400);
    }
  } catch {
    window.prompt("Copy review report", text);
  }
}

function exportReviewBoardJson() {
  const items = evidenceReviewItems();
  const payload = {
    app: "InduScout",
    version: "5.9",
    exportedAt: new Date().toISOString(),
    project: state.project,
    counts: {
      total: items.length,
      highPriority: items.filter((item) => item.priority === "High").length,
      sourceLeads: items.filter((item) => item.type === "Source lead").length,
      productRequests: state.productRequests.length,
      supplierActions: state.supplierReplies.filter(replyNeedsAction).length,
      quoteRisks: quoteDecisionInsights().scoredQuotes.filter((item) => item.flags.length).length
    },
    actions: evidenceActionPlan(items, {
      catalogCount: items.filter((item) => item.type === "Catalog review").length,
      sourceLeadCount: items.filter((item) => item.type === "Source lead").length,
      commercialCount: items.filter((item) => ["Supplier reply", "Quote risk"].includes(item.type)).length
    }),
    items
  };
  downloadFile(`InduScout-Evidence-Review-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(payload, null, 2), "application/json;charset=utf-8");
}

function reviewBoardReportText() {
  const items = evidenceReviewItems();
  const actions = evidenceActionPlan(items, {
    catalogCount: items.filter((item) => item.type === "Catalog review").length,
    sourceLeadCount: items.filter((item) => item.type === "Source lead").length,
    commercialCount: items.filter((item) => ["Supplier reply", "Quote risk"].includes(item.type)).length
  });

  return `InduScout evidence review board
Prepared on ${formatCopyDate()}

Project: ${projectValue("name", "TBC")}
Buyer/company: ${projectValue("buyer", "TBC")}

Review summary:
- Total review items: ${items.length}
- High priority: ${items.filter((item) => item.priority === "High").length}
- Source leads: ${items.filter((item) => item.type === "Source lead").length}
- Missing-product requests: ${state.productRequests.length}
- Supplier reply actions: ${state.supplierReplies.filter(replyNeedsAction).length}
- Quote risks: ${quoteDecisionInsights().scoredQuotes.filter((item) => item.flags.length).length}

Recommended action plan:
${actions.map((item, index) => `${index + 1}. ${item.title} - ${item.detail}`).join("\n")}

Review queue:
${items.slice(0, 20).map((item, index) => `${index + 1}. [${item.priority}] ${item.type} - ${item.title}: ${item.detail}`).join("\n") || "No review items currently open."}

InduScout is a discovery and RFQ preparation aid. Evidence should be reviewed before catalog confidence is raised or purchasing decisions are made.`;
}

function renderDecisionMemo() {
  if (!els.decisionStats || !els.decisionMemoTitle || !els.decisionMemoBody) {
    return;
  }

  const memo = decisionMemoData();
  els.decisionStats.innerHTML = [
    decisionStatTemplate("Readiness", `${memo.readiness.score}%`, memo.readiness.label),
    decisionStatTemplate("Recommendation", memo.quoteLead ? "Supplier lead" : "Draft only", memo.recommendationShort),
    decisionStatTemplate("Quote signal", memo.quoteLead ? memo.quoteLead.supplier : "TBC", memo.quoteSignal),
    decisionStatTemplate("Open risks", memo.highRisks.length, memo.highRisks.length ? "High priority validation items" : "No high priority risks open")
  ].join("");

  els.decisionMemoTitle.textContent = memo.projectTitle;
  els.decisionMemoBody.innerHTML = decisionMemoPreviewHtml(memo);
}

function decisionMemoData() {
  const shortlisted = state.shortlist.map((id) => products.find((product) => product.id === id)).filter(Boolean);
  const compared = state.compare.map((id) => products.find((product) => product.id === id)).filter(Boolean);
  const decision = quoteDecisionInsights();
  const reviewItems = evidenceReviewItems();
  const highRisks = reviewItems.filter((item) => item.priority === "High");
  const quoteLead = decision.recommended?.quote || null;
  const recommendedProduct = quoteLead
    ? products.find((product) => product.id === quoteLead.productId) || products.find((product) => product.sku === quoteLead.sku)
    : shortlisted[0] || compared[0] || null;
  const quoteScore = decision.recommended?.score || 0;
  const pricedQuotes = decision.scoredQuotes.filter((item) => item.priceTotal).length;
  const leadQuotes = decision.scoredQuotes.filter((item) => item.days).length;
  const receivedQuotes = state.quotes.filter((quote) => ["Received", "Best option"].includes(quote.status)).length;
  const readiness = decisionMemoReadiness({ shortlisted, quoteLead, highRisks, pricedQuotes, leadQuotes, receivedQuotes });
  const projectTitle = projectHasValue()
    ? `${projectValue("name", "Project")} decision memo`
    : "Draft buyer decision memo";
  const recommendedLine = quoteLead
    ? `Proceed to final supplier validation with ${quoteLead.supplier} for ${quoteLead.brand} ${quoteLead.sku}, subject to buyer checklist closure.`
    : shortlisted.length
      ? "Use the current shortlist to request comparable supplier quotes before approval."
      : "Add shortlist items and supplier quotes before issuing an approval recommendation.";
  const recommendationShort = quoteLead
    ? `${quoteLead.supplier} leads at score ${quoteScore}`
    : shortlisted.length
      ? "Quote comparison needed"
      : "Shortlist needed";
  const quoteSignal = quoteLead
    ? `${quoteTotalLabel(quoteLead)} | ${quoteLead.leadTime || "Lead TBC"}`
    : `${state.quotes.length} saved ${state.quotes.length === 1 ? "quote" : "quotes"}`;

  return {
    shortlisted,
    compared,
    decision,
    reviewItems,
    highRisks,
    quoteLead,
    quoteScore,
    pricedQuotes,
    leadQuotes,
    receivedQuotes,
    recommendedProduct,
    readiness,
    projectTitle,
    recommendedLine,
    recommendationShort,
    quoteSignal
  };
}

function decisionMemoReadiness({ shortlisted, quoteLead, highRisks, pricedQuotes, leadQuotes, receivedQuotes }) {
  const checks = [
    { ok: projectHasValue(), weight: 20 },
    { ok: shortlisted.length > 0, weight: 20 },
    { ok: receivedQuotes > 0 || pricedQuotes > 0, weight: 20 },
    { ok: Boolean(quoteLead) && leadQuotes > 0, weight: 20 },
    { ok: highRisks.length === 0, weight: 20 }
  ];
  const score = checks.reduce((total, item) => total + (item.ok ? item.weight : 0), 0);
  const label = score >= 80 ? "Ready for approval draft" : score >= 60 ? "Review before approval" : "Needs sourcing inputs";
  const detail = score >= 80
    ? "Memo can be used for internal review after buyer validation."
    : score >= 60
      ? "Close open commercial or evidence gaps before purchase approval."
      : "Add project context, shortlist, quotes, and validation evidence.";
  return { score, label, detail };
}

function decisionStatTemplate(label, value, detail) {
  return `
    <article class="decision-stat">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
      <small>${escapeHtml(detail)}</small>
    </article>
  `;
}

function decisionMemoPreviewHtml(memo) {
  const productLine = memo.recommendedProduct
    ? `${memo.recommendedProduct.brand} ${memo.recommendedProduct.sku} - ${memo.recommendedProduct.name}`
    : "Product TBC";
  const topQuotes = memo.decision.scoredQuotes.slice(0, 4);
  const topRisks = memo.reviewItems.slice(0, 5);
  const sourcePaths = memo.recommendedProduct?.sources.slice(0, 4) || [];

  return `
    <section class="decision-memo-section wide">
      <span>Recommended action</span>
      <p>${escapeHtml(memo.recommendedLine)}</p>
      <small>${escapeHtml(memo.readiness.detail)}</small>
    </section>
    <section class="decision-memo-section">
      <span>Project context</span>
      <dl class="decision-facts">
        <div><dt>Project</dt><dd>${escapeHtml(projectValue("name", "TBC"))}</dd></div>
        <div><dt>Buyer</dt><dd>${escapeHtml(projectValue("buyer", "TBC"))}</dd></div>
        <div><dt>Delivery</dt><dd>${escapeHtml(projectValue("country", "TBC"))}</dd></div>
        <div><dt>Target date</dt><dd>${escapeHtml(projectValue("targetDate", "TBC"))}</dd></div>
      </dl>
    </section>
    <section class="decision-memo-section">
      <span>Lead item</span>
      <p>${escapeHtml(productLine)}</p>
      <small>${escapeHtml(memo.quoteLead ? `${memo.quoteLead.supplier} | ${memo.quoteSignal}` : "Awaiting supplier quote lead.")}</small>
    </section>
    <section class="decision-memo-section">
      <span>Shortlist</span>
      <p>${escapeHtml(memo.shortlisted.length ? memo.shortlisted.slice(0, 5).map((product) => `${product.brand} ${product.sku}`).join(", ") : "No shortlist items selected yet.")}</p>
      <small>${memo.shortlisted.length} ${memo.shortlisted.length === 1 ? "item" : "items"} selected</small>
    </section>
    <section class="decision-memo-section">
      <span>Quote comparison</span>
      <p>${escapeHtml(topQuotes.length ? topQuotes.map((item) => `${item.quote.supplier}: ${item.score}`).join(", ") : "No scored supplier quote yet.")}</p>
      <small>${memo.pricedQuotes} priced, ${memo.leadQuotes} with lead-time signal</small>
    </section>
    <section class="decision-memo-section wide">
      <span>Validation focus</span>
      <ul>
        ${(topRisks.length ? topRisks : [{ priority: "Ready", type: "Evidence", title: "No open review item", detail: "Continue buyer validation before purchase." }])
          .map((item) => `<li><strong>${escapeHtml(item.priority)}:</strong> ${escapeHtml(item.type)} - ${escapeHtml(item.title)}. ${escapeHtml(item.detail)}</li>`)
          .join("")}
      </ul>
    </section>
    <section class="decision-memo-section wide">
      <span>Source paths to confirm</span>
      <ul>
        ${(sourcePaths.length ? sourcePaths : [{ type: "Supplier", name: "TBC", action: "Request official source path" }])
          .map((source) => `<li>${escapeHtml(source.type)} - ${escapeHtml(source.name)}: ${escapeHtml(source.action || "Verify source before order")}</li>`)
          .join("")}
      </ul>
    </section>
  `;
}

function decisionMemoText() {
  const memo = decisionMemoData();
  const shortlistLines = memo.shortlisted.length
    ? memo.shortlisted.map((product, index) => `${index + 1}. ${product.brand} ${product.sku} - ${product.name} | ${product.category} | fit ${product[state.priority]}`).join("\n")
    : "No shortlist items selected yet.";
  const quoteLines = memo.decision.scoredQuotes.length
    ? memo.decision.scoredQuotes.slice(0, 8).map((item, index) => {
      const quote = item.quote;
      const flags = item.flags.length ? item.flags.join(", ") : "No major quote flags";
      return `${index + 1}. ${quote.supplier} - ${quote.brand} ${quote.sku} | score ${item.score} | ${quoteTotalLabel(quote)} | lead ${quote.leadTime || "TBC"} | status ${quote.status} | ${flags}`;
    }).join("\n")
    : "No supplier quotes recorded yet.";
  const riskLines = memo.reviewItems.length
    ? memo.reviewItems.slice(0, 10).map((item, index) => `${index + 1}. [${item.priority}] ${item.type} - ${item.title}: ${item.detail}`).join("\n")
    : "No open evidence review items currently visible.";
  const leadProduct = memo.recommendedProduct
    ? `${memo.recommendedProduct.brand} ${memo.recommendedProduct.sku} - ${memo.recommendedProduct.name}`
    : "TBC";
  const leadSupplier = memo.quoteLead
    ? `${memo.quoteLead.supplier} | ${quoteTotalLabel(memo.quoteLead)} | ${memo.quoteLead.leadTime || "Lead TBC"} | score ${memo.quoteScore}`
    : "TBC";

  return `InduScout buyer decision memo
Prepared on ${formatCopyDate()}

Project:
- Project name: ${projectValue("name", "TBC")}
- Buyer/company: ${projectValue("buyer", "TBC")}
- Buyer contact: ${projectValue("contact", "TBC")}
- Delivery country: ${projectValue("country", "TBC")}
- Target date: ${projectValue("targetDate", "TBC")}
- Estimated quoted value: ${workspaceValueSummary()}

Decision readiness:
- Score: ${memo.readiness.score}%
- Status: ${memo.readiness.label}
- Note: ${memo.readiness.detail}

Recommended action:
${memo.recommendedLine}

Lead product:
${leadProduct}

Lead supplier / quote:
${leadSupplier}

Shortlist:
${shortlistLines}

Quote comparison:
${quoteLines}

Evidence and risk review:
${riskLines}

Project notes:
${projectValue("notes", "No project notes added.")}

Approval checklist before order:
- Confirm exact part number, suffix, voltage, size, material, and configuration.
- Confirm compatibility with installed equipment or project specification.
- Request latest datasheet, certificates, warranty path, and country of origin.
- Confirm stock, price, lead time, payment terms, delivery terms, and seller legitimacy.
- Treat alternates as technical review items, not automatic substitutes.
- Keep source evidence and supplier communication with the buyer file.

InduScout is a discovery and RFQ preparation aid. Final purchasing validation remains with the buyer and supplier.`;
}

async function copyDecisionMemo() {
  updateProjectFromFields();
  const text = decisionMemoText();
  try {
    await navigator.clipboard.writeText(text);
    if (els.copyDecisionMemo) {
      els.copyDecisionMemo.textContent = "Decision memo copied";
      setTimeout(() => {
        els.copyDecisionMemo.textContent = "Copy decision memo";
      }, 1400);
    }
  } catch {
    window.prompt("Copy decision memo", text);
  }
  renderDecisionMemo();
}

function downloadDecisionMemoHtml() {
  updateProjectFromFields();
  const projectSlug = safeFilenamePart(projectValue("name", ""));
  const date = new Date().toISOString().slice(0, 10);
  const filename = `InduScout-Decision-Memo${projectSlug ? `-${projectSlug}` : ""}-${date}.html`;
  downloadFile(filename, decisionMemoExportHtml(), "text/html;charset=utf-8");
  renderDecisionMemo();
}

function decisionMemoExportHtml() {
  const memo = decisionMemoData();
  const text = decisionMemoText();
  const title = memo.projectTitle;
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <style>
    :root { color-scheme: light; }
    body { margin: 0; font-family: Arial, Helvetica, sans-serif; color: #0f172a; background: #eef6f8; }
    main { max-width: 980px; margin: 0 auto; padding: 32px; }
    header, section { background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; margin-bottom: 14px; padding: 20px; }
    h1 { margin: 6px 0 10px; font-size: 32px; line-height: 1.05; }
    p, pre { font-size: 13px; line-height: 1.55; }
    pre { white-space: pre-wrap; font-family: Arial, Helvetica, sans-serif; margin: 0; }
    .eyebrow { color: #00766f; font-size: 12px; font-weight: 800; text-transform: uppercase; }
    .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin: 14px 0; }
    .stat { border: 1px solid #dbe7ef; border-radius: 8px; padding: 12px; }
    .stat span { display: block; color: #64748b; font-size: 11px; font-weight: 800; text-transform: uppercase; }
    .stat strong { display: block; margin-top: 6px; font-size: 22px; }
    button { background: #0f172a; color: #ffffff; border: 0; border-radius: 6px; padding: 10px 14px; font-weight: 800; }
    @media print { body { background: #ffffff; } main { padding: 0; } button { display: none; } header, section { break-inside: avoid; } }
  </style>
</head>
<body>
  <main>
    <header>
      <div class="eyebrow">InduScout buyer decision memo</div>
      <h1>${escapeHtml(title)}</h1>
      <p>Prepared on ${escapeHtml(formatCopyDate())}. Use this memo as an internal approval draft after buyer validation.</p>
      <button onclick="window.print()">Save as PDF</button>
    </header>
    <div class="stats">
      <div class="stat"><span>Readiness</span><strong>${escapeHtml(`${memo.readiness.score}%`)}</strong></div>
      <div class="stat"><span>Shortlist</span><strong>${escapeHtml(memo.shortlisted.length)}</strong></div>
      <div class="stat"><span>Quotes</span><strong>${escapeHtml(state.quotes.length)}</strong></div>
      <div class="stat"><span>High risks</span><strong>${escapeHtml(memo.highRisks.length)}</strong></div>
    </div>
    <section>
      <pre>${escapeHtml(text)}</pre>
    </section>
  </main>
</body>
</html>`;
}

function renderAwardHandover() {
  if (!els.awardStats || !els.awardHandoverTitle || !els.awardChecklist || !els.awardHandoverBody) {
    return;
  }

  const award = awardHandoverData();
  els.awardStats.innerHTML = [
    awardStatTemplate("PO readiness", `${award.readiness}%`, award.readinessLabel),
    awardStatTemplate("Supplier", award.quote ? award.quote.supplier : "TBC", award.quote ? "Current quote lead" : "Needs quote lead"),
    awardStatTemplate("Commercial", award.commercialReady ? "Ready" : "Review", award.commercialDetail),
    awardStatTemplate("Blockers", award.blockers.length, award.blockers.length ? "Items to close before PO" : "No major blockers open")
  ].join("");

  els.awardHandoverTitle.textContent = award.title;
  els.awardChecklist.innerHTML = award.checks.map(awardCheckTemplate).join("");
  els.awardHandoverBody.innerHTML = awardHandoverPreviewHtml(award);
  renderComplianceGate();
}

function awardHandoverData() {
  const memo = decisionMemoData();
  const quote = memo.quoteLead;
  const product = memo.recommendedProduct;
  const primarySource = quote?.sourceUrl
    ? { type: "Quote source", name: quote.supplier, url: quote.sourceUrl, action: "Confirm final quotation and seller terms" }
    : product?.sources[0] || null;
  const hasPrice = Boolean(quote && quoteEstimatedTotal(quote));
  const hasLead = Boolean(quote?.leadTime);
  const hasPayment = quote ? hasMeaningfulTerm(quote.paymentTerms) : false;
  const hasDelivery = quote ? hasMeaningfulTerm(quote.deliveryTerms) : false;
  const commercialReady = Boolean(quote && hasPrice && hasLead && hasPayment && hasDelivery);
  const documentReady = Boolean(product?.datasheet && product?.certifications?.length);
  const riskReady = memo.highRisks.length === 0;
  const checks = [
    {
      label: "Product identity",
      status: product ? "Review" : "Missing",
      detail: product ? `${product.brand} ${product.sku}; confirm suffix, configuration, and compatibility.` : "Select a product from shortlist or quote lead."
    },
    {
      label: "Supplier selection",
      status: quote ? "Ready" : "Missing",
      detail: quote ? `${quote.supplier} is current quote lead at score ${memo.quoteScore}.` : "Record at least one supplier quote before award."
    },
    {
      label: "Commercial terms",
      status: commercialReady ? "Ready" : quote ? "Review" : "Missing",
      detail: quote ? `${quoteTotalLabel(quote)}; lead ${quote.leadTime || "TBC"}; payment ${quote.paymentTerms || "TBC"}; delivery ${quote.deliveryTerms || "TBC"}.` : "Price, quantity, lead time, payment, and delivery terms are needed."
    },
    {
      label: "Documents",
      status: documentReady ? "Review" : "Missing",
      detail: product ? `Request latest datasheet and certificates: ${product.certifications.join(", ") || "certificates TBC"}.` : "Datasheet and certificate path needed."
    },
    {
      label: "Evidence risks",
      status: riskReady ? "Ready" : "Review",
      detail: riskReady ? "No high priority review items currently open." : `${memo.highRisks.length} high priority evidence or commercial item needs closure.`
    }
  ];
  const blockers = [
    ...checks.filter((item) => item.status === "Missing" || (item.status === "Review" && item.label === "Evidence risks")),
    ...memo.highRisks.slice(0, 5).map((item) => ({
      label: item.type,
      status: "Review",
      detail: `${item.title}: ${item.detail}`
    }))
  ];
  const readinessPoints = checks.reduce((total, item) => total + (item.status === "Ready" ? 20 : item.status === "Review" ? 10 : 0), 0);
  const readiness = Math.min(100, readinessPoints);
  const readinessLabel = readiness >= 80 ? "Ready for PO prep" : readiness >= 60 ? "Buyer review needed" : "Not award-ready";
  const title = projectHasValue()
    ? `${projectValue("name", "Project")} award handover`
    : "Draft award handover pack";
  const recommendation = quote
    ? `Prepare PO handoff for ${quote.supplier} only after final seller, stock, document, and term confirmation.`
    : "Record supplier quote data and select a quote lead before preparing PO handoff.";
  const commercialDetail = commercialReady
    ? `${quoteTotalLabel(quote)} with lead and terms captured`
    : quote
      ? "Quote exists, but price, lead, payment, or delivery terms need review"
      : "No supplier quote lead yet";

  return {
    memo,
    quote,
    product,
    primarySource,
    checks,
    blockers,
    readiness,
    readinessLabel,
    title,
    recommendation,
    commercialReady,
    commercialDetail
  };
}

function awardStatTemplate(label, value, detail) {
  return `
    <article class="award-stat">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
      <small>${escapeHtml(detail)}</small>
    </article>
  `;
}

function awardCheckTemplate(item) {
  const statusClass = item.status.toLowerCase();
  return `
    <article class="award-check ${escapeHtml(statusClass)}">
      <div>
        <span>${escapeHtml(item.label)}</span>
        <strong>${escapeHtml(item.status)}</strong>
      </div>
      <p>${escapeHtml(item.detail)}</p>
    </article>
  `;
}

function awardHandoverPreviewHtml(award) {
  const productLabel = award.product ? `${award.product.brand} ${award.product.sku} - ${award.product.name}` : "Product TBC";
  const quoteLabel = award.quote
    ? `${award.quote.supplier} | ${quoteTotalLabel(award.quote)} | ${award.quote.leadTime || "Lead TBC"}`
    : "Supplier quote lead TBC";
  const sourceLabel = award.primarySource
    ? `${award.primarySource.type} - ${award.primarySource.name}`
    : "Source path TBC";
  const blockerItems = award.blockers.length ? award.blockers.slice(0, 6) : [{ label: "Ready", status: "Ready", detail: "Proceed only after final buyer and supplier confirmation." }];

  return `
    <section class="award-panel wide">
      <span>Recommended handover action</span>
      <p>${escapeHtml(award.recommendation)}</p>
    </section>
    <section class="award-panel">
      <span>PO candidate</span>
      <p>${escapeHtml(productLabel)}</p>
      <small>${escapeHtml(quoteLabel)}</small>
    </section>
    <section class="award-panel">
      <span>Primary source path</span>
      <p>${escapeHtml(sourceLabel)}</p>
      <small>${escapeHtml(award.primarySource?.action || "Verify source and seller legitimacy before PO.")}</small>
    </section>
    <section class="award-panel wide">
      <span>Close before purchase order</span>
      <ul>
        ${blockerItems.map((item) => `<li><strong>${escapeHtml(item.status)}:</strong> ${escapeHtml(item.label)} - ${escapeHtml(item.detail)}</li>`).join("")}
      </ul>
    </section>
    <section class="award-panel wide">
      <span>PO fields to confirm</span>
      <ul>
        <li>Legal supplier name, billing address, tax or registration details, and payment beneficiary.</li>
        <li>Exact part number, quantity, unit price, currency, delivery country, delivery term, and promised lead time.</li>
        <li>Warranty path, return terms, certificates, country of origin, and latest datasheet revision.</li>
        <li>Buyer approver, budget code, project reference, and internal receiving location.</li>
      </ul>
    </section>
  `;
}

function awardHandoverText() {
  const award = awardHandoverData();
  const quote = award.quote;
  const product = award.product;
  const productLine = product ? `${product.brand} ${product.sku} - ${product.name}` : "TBC";
  const quoteLine = quote
    ? `${quote.supplier} | ${quoteTotalLabel(quote)} | lead ${quote.leadTime || "TBC"} | payment ${quote.paymentTerms || "TBC"} | delivery ${quote.deliveryTerms || "TBC"}`
    : "TBC";
  const checkLines = award.checks.map((item, index) => `${index + 1}. [${item.status}] ${item.label}: ${item.detail}`).join("\n");
  const blockerLines = award.blockers.length
    ? award.blockers.slice(0, 8).map((item, index) => `${index + 1}. [${item.status}] ${item.label}: ${item.detail}`).join("\n")
    : "No major blockers currently open. Final buyer and supplier confirmation still required.";

  return `InduScout award handover / PO preparation pack
Prepared on ${formatCopyDate()}

Project:
- Project name: ${projectValue("name", "TBC")}
- Buyer/company: ${projectValue("buyer", "TBC")}
- Buyer contact: ${projectValue("contact", "TBC")}
- Delivery country: ${projectValue("country", "TBC")}
- Target date: ${projectValue("targetDate", "TBC")}

Award readiness:
- Score: ${award.readiness}%
- Status: ${award.readinessLabel}

Recommended action:
${award.recommendation}

PO candidate:
${productLine}

Supplier / commercial lead:
${quoteLine}

Primary source path:
${award.primarySource ? `${award.primarySource.type} - ${award.primarySource.name}: ${award.primarySource.url || "URL TBC"}` : "TBC"}

Readiness checklist:
${checkLines}

Blockers to close before PO:
${blockerLines}

PO fields to confirm:
- Legal supplier name, billing address, tax or registration details, and payment beneficiary.
- Exact part number, quantity, unit price, currency, delivery country, delivery term, and promised lead time.
- Warranty path, return terms, certificates, country of origin, and latest datasheet revision.
- Buyer approver, budget code, project reference, and internal receiving location.

Buyer notes:
${projectValue("notes", "No project notes added.")}

InduScout is a discovery and RFQ preparation aid. Final purchase order validation remains with the buyer, supplier, and internal approval process.`;
}

function supplierAwardEmailText() {
  const award = awardHandoverData();
  const quote = award.quote;
  const product = award.product;
  const subject = `Final confirmation before PO - ${product ? `${product.brand} ${product.sku}` : "InduScout RFQ item"} - ${projectValue("name", "Project")}`;

  return `Subject: ${subject}

Dear ${quote?.supplier || "Supplier"},

We are preparing final internal review for the following item:

Product: ${product ? `${product.brand} ${product.sku} - ${product.name}` : "TBC"}
Project: ${projectValue("name", "TBC")}
Delivery country: ${projectValue("country", "TBC")}
Target date: ${projectValue("targetDate", "TBC")}

Before PO release, please confirm:
- Exact part number, suffix, configuration, and compatibility notes.
- Quantity, unit price, currency, quoted total, lead time, and stock status.
- Payment terms, delivery terms, warranty path, return terms, and validity date.
- Latest datasheet, certificates, country of origin, and authorized seller status where applicable.
- Legal supplier name, billing address, tax or registration details, and payment beneficiary.

Buyer notes:
${projectValue("notes", "No special buyer notes added.")}

Please reply with confirmation or any exceptions before we proceed with internal approval.

Regards,
${projectValue("buyer", "Buyer")}`;
}

async function copyAwardHandover() {
  updateProjectFromFields();
  const text = awardHandoverText();
  try {
    await navigator.clipboard.writeText(text);
    if (els.copyAwardHandover) {
      els.copyAwardHandover.textContent = "Handover copied";
      setTimeout(() => {
        els.copyAwardHandover.textContent = "Copy handover note";
      }, 1400);
    }
  } catch {
    window.prompt("Copy award handover", text);
  }
  renderAwardHandover();
}

async function copySupplierAwardEmail() {
  updateProjectFromFields();
  const text = supplierAwardEmailText();
  try {
    await navigator.clipboard.writeText(text);
    if (els.copySupplierAwardEmail) {
      els.copySupplierAwardEmail.textContent = "Supplier email copied";
      setTimeout(() => {
        els.copySupplierAwardEmail.textContent = "Copy supplier confirmation";
      }, 1400);
    }
  } catch {
    window.prompt("Copy supplier confirmation", text);
  }
  renderAwardHandover();
}

function downloadAwardHandoverHtml() {
  updateProjectFromFields();
  const projectSlug = safeFilenamePart(projectValue("name", ""));
  const date = new Date().toISOString().slice(0, 10);
  const filename = `InduScout-PO-Handover${projectSlug ? `-${projectSlug}` : ""}-${date}.html`;
  downloadFile(filename, awardHandoverExportHtml(), "text/html;charset=utf-8");
  renderAwardHandover();
}

function awardHandoverExportHtml() {
  const award = awardHandoverData();
  const handover = awardHandoverText();
  const supplierEmail = supplierAwardEmailText();
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(award.title)}</title>
  <style>
    :root { color-scheme: light; }
    body { margin: 0; font-family: Arial, Helvetica, sans-serif; color: #0f172a; background: #eef6f8; }
    main { max-width: 980px; margin: 0 auto; padding: 32px; }
    header, section { background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; margin-bottom: 14px; padding: 20px; }
    h1 { margin: 6px 0 10px; font-size: 32px; line-height: 1.05; }
    h2 { font-size: 18px; }
    p, pre { font-size: 13px; line-height: 1.55; }
    pre { white-space: pre-wrap; font-family: Arial, Helvetica, sans-serif; margin: 0; }
    .eyebrow { color: #00766f; font-size: 12px; font-weight: 800; text-transform: uppercase; }
    .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin: 14px 0; }
    .stat { border: 1px solid #dbe7ef; border-radius: 8px; padding: 12px; }
    .stat span { display: block; color: #64748b; font-size: 11px; font-weight: 800; text-transform: uppercase; }
    .stat strong { display: block; margin-top: 6px; font-size: 22px; }
    button { background: #0f172a; color: #ffffff; border: 0; border-radius: 6px; padding: 10px 14px; font-weight: 800; }
    @media print { body { background: #ffffff; } main { padding: 0; } button { display: none; } header, section { break-inside: avoid; } }
  </style>
</head>
<body>
  <main>
    <header>
      <div class="eyebrow">InduScout award handover</div>
      <h1>${escapeHtml(award.title)}</h1>
      <p>Prepared on ${escapeHtml(formatCopyDate())}. Use this as a PO preparation pack after buyer and supplier validation.</p>
      <button onclick="window.print()">Save as PDF</button>
    </header>
    <div class="stats">
      <div class="stat"><span>PO readiness</span><strong>${escapeHtml(`${award.readiness}%`)}</strong></div>
      <div class="stat"><span>Supplier</span><strong>${escapeHtml(award.quote?.supplier || "TBC")}</strong></div>
      <div class="stat"><span>Commercial</span><strong>${escapeHtml(award.commercialReady ? "Ready" : "Review")}</strong></div>
      <div class="stat"><span>Blockers</span><strong>${escapeHtml(award.blockers.length)}</strong></div>
    </div>
    <section>
      <h2>Handover Note</h2>
      <pre>${escapeHtml(handover)}</pre>
    </section>
    <section>
      <h2>Supplier Confirmation Email</h2>
      <pre>${escapeHtml(supplierEmail)}</pre>
    </section>
  </main>
</body>
</html>`;
}

function renderComplianceGate() {
  if (!els.complianceStats || !els.complianceTitle || !els.complianceChecklist || !els.complianceBody) {
    return;
  }

  const compliance = complianceGateData();
  els.complianceStats.innerHTML = [
    complianceStatTemplate("Compliance score", `${compliance.score}%`, compliance.statusLabel),
    complianceStatTemplate("Supplier", compliance.supplierName, compliance.supplierDetail),
    complianceStatTemplate("Required checks", compliance.requiredCount, "Due-diligence items to request"),
    complianceStatTemplate("Missing inputs", compliance.missingCount, compliance.missingCount ? "Needs buyer follow-up" : "No missing source input")
  ].join("");

  els.complianceTitle.textContent = compliance.title;
  els.complianceChecklist.innerHTML = compliance.checks.map(complianceCheckTemplate).join("");
  els.complianceBody.innerHTML = compliancePreviewHtml(compliance);
  renderBuyerFile();
}

function complianceGateData() {
  const award = awardHandoverData();
  const quote = award.quote;
  const product = award.product;
  const source = award.primarySource;
  const supplierName = quote?.supplier || source?.name || "Supplier TBC";
  const supplierDetail = quote ? "Quote lead supplier" : source ? source.type : "Add quote or source path";
  const hasSupplier = Boolean(quote || source);
  const hasSourceUrl = Boolean(quote?.sourceUrl || source?.url);
  const strongSource = Boolean(source && /oem|distributor|quote source/i.test(source.type));
  const hasDocs = Boolean(product?.datasheet && product?.certifications?.length);
  const commercialReady = award.commercialReady;
  const hasProject = projectHasValue();
  const quoteNotes = `${quote?.notes || ""} ${quote?.paymentTerms || ""} ${quote?.deliveryTerms || ""}`.toLowerCase();
  const hasWarrantySignal = /warranty|return|authorized|certificate|origin/.test(quoteNotes);
  const checks = [
    {
      label: "Supplier identity",
      status: hasSupplier ? "Review" : "Missing",
      detail: hasSupplier ? `Confirm legal entity, address, registration, tax ID, and official contact for ${supplierName}.` : "Select or record a supplier before compliance review."
    },
    {
      label: "Seller authorization",
      status: strongSource ? "Review" : hasSourceUrl ? "Request" : "Missing",
      detail: strongSource ? "Source path suggests OEM, distributor, or quote path; confirm authorization evidence before award." : "Request authorization proof or seller legitimacy evidence."
    },
    {
      label: "Document pack",
      status: hasDocs ? "Review" : "Request",
      detail: product ? `Request latest datasheet, certificates, country of origin, and warranty path for ${product.brand} ${product.sku}.` : "Request product documents after selecting a lead product."
    },
    {
      label: "Commercial terms",
      status: commercialReady ? "Ready" : quote ? "Review" : "Missing",
      detail: quote ? `Confirm ${quoteTotalLabel(quote)}, lead ${quote.leadTime || "TBC"}, payment ${quote.paymentTerms || "TBC"}, delivery ${quote.deliveryTerms || "TBC"}.` : "Record supplier quote, price, lead time, payment, and delivery terms."
    },
    {
      label: "Payment safety",
      status: "Request",
      detail: "Verify beneficiary name, bank details, payment change controls, and internal approval before releasing funds."
    },
    {
      label: "Trade compliance",
      status: "Request",
      detail: "Check export restrictions, sanctions screening, end-use requirements, and local import rules where applicable."
    },
    {
      label: "Warranty and returns",
      status: hasWarrantySignal ? "Review" : "Request",
      detail: "Confirm warranty owner, return window, defect process, and who handles post-sale support."
    },
    {
      label: "Buyer approval file",
      status: hasProject && award.readiness >= 70 ? "Review" : "Missing",
      detail: hasProject ? "Attach decision memo, award handover, supplier confirmations, and quote evidence to the buyer file." : "Add project context before generating the approval file."
    }
  ];
  const score = complianceScore(checks);
  const requiredCount = checks.filter((item) => item.status === "Request").length;
  const missingCount = checks.filter((item) => item.status === "Missing").length;
  const statusLabel = score >= 78 ? "Ready for due-diligence review" : score >= 58 ? "Supplier checks needed" : "Not compliance-ready";
  const title = projectHasValue()
    ? `${projectValue("name", "Project")} supplier compliance gate`
    : "Draft supplier compliance gate";
  const recommendation = missingCount
    ? "Close missing supplier, quote, project, or source inputs before award approval."
    : requiredCount
      ? "Send the due-diligence request and attach supplier responses before PO release."
      : "Review supplied evidence and keep confirmations with the buyer approval file.";

  return {
    award,
    quote,
    product,
    source,
    supplierName,
    supplierDetail,
    checks,
    score,
    requiredCount,
    missingCount,
    statusLabel,
    title,
    recommendation
  };
}

function complianceScore(checks) {
  const points = checks.reduce((total, item) => {
    if (item.status === "Ready") {
      return total + 12.5;
    }
    if (item.status === "Review") {
      return total + 9;
    }
    if (item.status === "Request") {
      return total + 5;
    }
    return total;
  }, 0);
  return Math.min(100, Math.round(points));
}

function complianceStatTemplate(label, value, detail) {
  return `
    <article class="compliance-stat">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
      <small>${escapeHtml(detail)}</small>
    </article>
  `;
}

function complianceCheckTemplate(item) {
  const statusClass = item.status.toLowerCase();
  return `
    <article class="compliance-check ${escapeHtml(statusClass)}">
      <div>
        <span>${escapeHtml(item.label)}</span>
        <strong>${escapeHtml(item.status)}</strong>
      </div>
      <p>${escapeHtml(item.detail)}</p>
    </article>
  `;
}

function compliancePreviewHtml(compliance) {
  const productLabel = compliance.product ? `${compliance.product.brand} ${compliance.product.sku} - ${compliance.product.name}` : "Product TBC";
  const sourceLabel = compliance.source ? `${compliance.source.type} - ${compliance.source.name}` : "Source path TBC";
  const requestItems = compliance.checks.filter((item) => ["Request", "Missing"].includes(item.status));

  return `
    <section class="compliance-panel wide">
      <span>Compliance recommendation</span>
      <p>${escapeHtml(compliance.recommendation)}</p>
      <small>InduScout prepares the checklist; final supplier approval remains with the buyer and internal process.</small>
    </section>
    <section class="compliance-panel">
      <span>Supplier under review</span>
      <p>${escapeHtml(compliance.supplierName)}</p>
      <small>${escapeHtml(sourceLabel)}</small>
    </section>
    <section class="compliance-panel">
      <span>Product context</span>
      <p>${escapeHtml(productLabel)}</p>
      <small>${escapeHtml(compliance.quote ? `${quoteTotalLabel(compliance.quote)} | ${compliance.quote.leadTime || "Lead TBC"}` : "Commercial quote TBC")}</small>
    </section>
    <section class="compliance-panel wide">
      <span>Evidence to request or attach</span>
      <ul>
        ${(requestItems.length ? requestItems : compliance.checks.slice(0, 4))
          .map((item) => `<li><strong>${escapeHtml(item.status)}:</strong> ${escapeHtml(item.label)} - ${escapeHtml(item.detail)}</li>`)
          .join("")}
      </ul>
    </section>
    <section class="compliance-panel wide">
      <span>Buyer file should include</span>
      <ul>
        <li>Quote, commercial terms, supplier confirmation email, and any revised quotation.</li>
        <li>Datasheet, certificates, warranty path, country of origin, and authorized seller evidence.</li>
        <li>Bank verification, payment approval, import/export screening, and internal PO approval reference.</li>
      </ul>
    </section>
  `;
}

function compliancePackText() {
  const compliance = complianceGateData();
  const award = compliance.award;
  const checkLines = compliance.checks.map((item, index) => `${index + 1}. [${item.status}] ${item.label}: ${item.detail}`).join("\n");

  return `InduScout supplier compliance gate
Prepared on ${formatCopyDate()}

Project:
- Project name: ${projectValue("name", "TBC")}
- Buyer/company: ${projectValue("buyer", "TBC")}
- Buyer contact: ${projectValue("contact", "TBC")}
- Delivery country: ${projectValue("country", "TBC")}
- Target date: ${projectValue("targetDate", "TBC")}

Supplier:
- Supplier name: ${compliance.supplierName}
- Source path: ${compliance.source ? `${compliance.source.type} - ${compliance.source.name}: ${compliance.source.url || "URL TBC"}` : "TBC"}

Product / award context:
- Product: ${compliance.product ? `${compliance.product.brand} ${compliance.product.sku} - ${compliance.product.name}` : "TBC"}
- Quote lead: ${compliance.quote ? `${compliance.quote.supplier} | ${quoteTotalLabel(compliance.quote)} | lead ${compliance.quote.leadTime || "TBC"}` : "TBC"}
- Award readiness: ${award.readiness}% - ${award.readinessLabel}

Compliance score:
- Score: ${compliance.score}%
- Status: ${compliance.statusLabel}
- Recommendation: ${compliance.recommendation}

Due-diligence checklist:
${checkLines}

Supplier evidence to request:
- Legal entity name, address, registration, tax ID, official contact, and website domain.
- Authorized seller, distributor, or OEM relationship evidence where applicable.
- Latest quotation, stock confirmation, price validity, payment terms, delivery terms, and delivery country.
- Datasheet, certificates, country of origin, warranty, return process, and post-sale support path.
- Bank beneficiary confirmation and payment change control.
- Export, sanctions, end-use, and local import compliance confirmation where applicable.

Buyer notes:
${projectValue("notes", "No project notes added.")}

InduScout is a discovery and RFQ preparation aid. This is not legal, tax, sanctions, or compliance advice. Final supplier approval remains with the buyer and internal compliance process.`;
}

function supplierDueDiligenceEmailText() {
  const compliance = complianceGateData();
  const product = compliance.product;
  const quote = compliance.quote;
  const subject = `Supplier due diligence request - ${product ? `${product.brand} ${product.sku}` : "InduScout RFQ item"} - ${projectValue("name", "Project")}`;

  return `Subject: ${subject}

Dear ${compliance.supplierName},

We are completing supplier due diligence before internal award review for the following item:

Product: ${product ? `${product.brand} ${product.sku} - ${product.name}` : "TBC"}
Project: ${projectValue("name", "TBC")}
Delivery country: ${projectValue("country", "TBC")}
Quote reference: ${quote ? `${quoteTotalLabel(quote)} | lead ${quote.leadTime || "TBC"}` : "TBC"}

Please confirm and provide, where applicable:
- Legal company name, registration number, tax ID, registered address, and official contact.
- Manufacturer, authorized distributor, reseller, or surplus seller status, with evidence if available.
- Latest quotation, price validity, stock status, payment terms, delivery terms, and warranty/return terms.
- Latest datasheet, certificates, country of origin, and any compliance declarations.
- Bank beneficiary name and payment instructions through an official company channel.
- Any export restriction, end-use limitation, or local import requirement known to your team.

Buyer notes:
${projectValue("notes", "No special buyer notes added.")}

Please reply with documents or exceptions so we can complete internal buyer review.

Regards,
${projectValue("buyer", "Buyer")}`;
}

async function copyCompliancePack() {
  updateProjectFromFields();
  const text = compliancePackText();
  try {
    await navigator.clipboard.writeText(text);
    if (els.copyCompliancePack) {
      els.copyCompliancePack.textContent = "Compliance pack copied";
      setTimeout(() => {
        els.copyCompliancePack.textContent = "Copy compliance pack";
      }, 1400);
    }
  } catch {
    window.prompt("Copy compliance pack", text);
  }
  renderComplianceGate();
}

async function copySupplierDueDiligenceEmail() {
  updateProjectFromFields();
  const text = supplierDueDiligenceEmailText();
  try {
    await navigator.clipboard.writeText(text);
    if (els.copySupplierDueDiligence) {
      els.copySupplierDueDiligence.textContent = "Due-diligence email copied";
      setTimeout(() => {
        els.copySupplierDueDiligence.textContent = "Copy supplier due-diligence email";
      }, 1400);
    }
  } catch {
    window.prompt("Copy supplier due-diligence email", text);
  }
  renderComplianceGate();
}

function downloadCompliancePackHtml() {
  updateProjectFromFields();
  const projectSlug = safeFilenamePart(projectValue("name", ""));
  const date = new Date().toISOString().slice(0, 10);
  const filename = `InduScout-Supplier-Compliance${projectSlug ? `-${projectSlug}` : ""}-${date}.html`;
  downloadFile(filename, compliancePackExportHtml(), "text/html;charset=utf-8");
  renderComplianceGate();
}

function compliancePackExportHtml() {
  const compliance = complianceGateData();
  const pack = compliancePackText();
  const email = supplierDueDiligenceEmailText();
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(compliance.title)}</title>
  <style>
    :root { color-scheme: light; }
    body { margin: 0; font-family: Arial, Helvetica, sans-serif; color: #0f172a; background: #eef6f8; }
    main { max-width: 980px; margin: 0 auto; padding: 32px; }
    header, section { background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; margin-bottom: 14px; padding: 20px; }
    h1 { margin: 6px 0 10px; font-size: 32px; line-height: 1.05; }
    h2 { font-size: 18px; }
    p, pre { font-size: 13px; line-height: 1.55; }
    pre { white-space: pre-wrap; font-family: Arial, Helvetica, sans-serif; margin: 0; }
    .eyebrow { color: #00766f; font-size: 12px; font-weight: 800; text-transform: uppercase; }
    .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin: 14px 0; }
    .stat { border: 1px solid #dbe7ef; border-radius: 8px; padding: 12px; }
    .stat span { display: block; color: #64748b; font-size: 11px; font-weight: 800; text-transform: uppercase; }
    .stat strong { display: block; margin-top: 6px; font-size: 22px; }
    button { background: #0f172a; color: #ffffff; border: 0; border-radius: 6px; padding: 10px 14px; font-weight: 800; }
    @media print { body { background: #ffffff; } main { padding: 0; } button { display: none; } header, section { break-inside: avoid; } }
  </style>
</head>
<body>
  <main>
    <header>
      <div class="eyebrow">InduScout supplier compliance gate</div>
      <h1>${escapeHtml(compliance.title)}</h1>
      <p>Prepared on ${escapeHtml(formatCopyDate())}. Use this as a buyer due-diligence pack before supplier award or PO release.</p>
      <button onclick="window.print()">Save as PDF</button>
    </header>
    <div class="stats">
      <div class="stat"><span>Compliance score</span><strong>${escapeHtml(`${compliance.score}%`)}</strong></div>
      <div class="stat"><span>Supplier</span><strong>${escapeHtml(compliance.supplierName)}</strong></div>
      <div class="stat"><span>Required checks</span><strong>${escapeHtml(compliance.requiredCount)}</strong></div>
      <div class="stat"><span>Missing inputs</span><strong>${escapeHtml(compliance.missingCount)}</strong></div>
    </div>
    <section>
      <h2>Compliance Pack</h2>
      <pre>${escapeHtml(pack)}</pre>
    </section>
    <section>
      <h2>Supplier Due-Diligence Email</h2>
      <pre>${escapeHtml(email)}</pre>
    </section>
  </main>
</body>
</html>`;
}

function renderBuyerFile() {
  if (!els.buyerFileStats || !els.buyerFileTitle || !els.buyerFileChecklist || !els.buyerFileTimeline) {
    return;
  }

  const file = buyerFileData();
  els.buyerFileStats.innerHTML = [
    buyerFileStatTemplate("File score", `${file.score}%`, file.statusLabel),
    buyerFileStatTemplate("File items", file.readyItems, `${file.items.length} sections tracked`),
    buyerFileStatTemplate("Open gaps", file.openGaps, file.openGaps ? "Needs buyer follow-up" : "Ready for internal review"),
    buyerFileStatTemplate("Timeline", file.timeline.length, "Session evidence events")
  ].join("");

  els.buyerFileTitle.textContent = file.title;
  els.buyerFileChecklist.innerHTML = file.items.map(buyerFileItemTemplate).join("");
  els.buyerFileTimeline.innerHTML = buyerFileTimelineHtml(file);
}

function buyerFileData() {
  const memo = decisionMemoData();
  const award = awardHandoverData();
  const compliance = complianceGateData();
  const reviewItems = evidenceReviewItems();
  const shortlisted = state.shortlist.map((id) => products.find((product) => product.id === id)).filter(Boolean);
  const compared = state.compare.map((id) => products.find((product) => product.id === id)).filter(Boolean);
  const notesCount = Object.values(state.notes).filter((note) => String(note || "").trim()).length;
  const receivedQuotes = state.quotes.filter((quote) => ["Received", "Best option"].includes(quote.status)).length;
  const supplierActions = state.supplierReplies.filter(replyNeedsAction).length;
  const items = [
    {
      label: "Project profile",
      status: projectHasValue() ? "Ready" : "Missing",
      detail: projectHasValue() ? `${projectValue("name", "Project")} | ${projectValue("buyer", "Buyer TBC")}` : "Add project name, buyer, delivery country, target date, and notes."
    },
    {
      label: "Shortlist record",
      status: shortlisted.length ? "Ready" : "Missing",
      detail: shortlisted.length ? `${shortlisted.length} product ${shortlisted.length === 1 ? "item" : "items"} selected for buyer file.` : "Add at least one product to shortlist."
    },
    {
      label: "Compare evidence",
      status: compared.length ? "Review" : "Open",
      detail: compared.length ? `${compared.length} product ${compared.length === 1 ? "item" : "items"} in comparison.` : "Use compare for alternates, lead time, MOQ, certifications, and source review."
    },
    {
      label: "Quote register",
      status: state.quotes.length ? "Ready" : "Missing",
      detail: state.quotes.length ? `${state.quotes.length} saved ${state.quotes.length === 1 ? "quote" : "quotes"}; ${receivedQuotes} received or preferred.` : "Save supplier quote records before award."
    },
    {
      label: "Supplier reply log",
      status: state.supplierReplies.length ? "Review" : "Open",
      detail: state.supplierReplies.length ? `${state.supplierReplies.length} replies logged; ${supplierActions} need buyer action.` : "Capture supplier replies, certificates, alternates, and next actions."
    },
    {
      label: "Source evidence",
      status: state.sourceLeads.length ? "Review" : "Open",
      detail: state.sourceLeads.length ? `${state.sourceLeads.length} source leads captured for review.` : "Add supplier/source leads if new channels are discovered."
    },
    {
      label: "Evidence review board",
      status: reviewItems.length ? "Review" : "Ready",
      detail: reviewItems.length ? `${reviewItems.length} review items; ${reviewItems.filter((item) => item.priority === "High").length} high priority.` : "No open review items currently visible."
    },
    {
      label: "Decision memo",
      status: memo.readiness.score >= 80 ? "Ready" : memo.readiness.score >= 60 ? "Review" : "Draft",
      detail: `${memo.readiness.score}% - ${memo.readiness.label}.`
    },
    {
      label: "Award handover",
      status: award.readiness >= 80 ? "Ready" : award.readiness >= 60 ? "Review" : "Draft",
      detail: `${award.readiness}% - ${award.readinessLabel}.`
    },
    {
      label: "Supplier compliance",
      status: compliance.score >= 78 ? "Ready" : compliance.score >= 58 ? "Review" : "Draft",
      detail: `${compliance.score}% - ${compliance.statusLabel}.`
    },
    {
      label: "Buyer notes",
      status: notesCount ? "Review" : "Open",
      detail: notesCount ? `${notesCount} product note ${notesCount === 1 ? "entry" : "entries"} saved locally.` : "Add buyer notes for compatibility, project, or supplier instructions."
    }
  ];
  const score = buyerFileScore(items);
  const readyItems = items.filter((item) => item.status === "Ready").length;
  const openGaps = items.filter((item) => ["Missing", "Draft"].includes(item.status)).length;
  const title = projectHasValue() ? `${projectValue("name", "Project")} buyer file` : "Draft buyer file";
  const statusLabel = score >= 82 ? "Audit file ready" : score >= 60 ? "Review gaps before approval" : "Needs sourcing records";
  const timeline = buyerFileTimelineEvents({ memo, award, compliance, reviewItems, shortlisted, compared });

  return {
    memo,
    award,
    compliance,
    reviewItems,
    shortlisted,
    compared,
    items,
    score,
    readyItems,
    openGaps,
    title,
    statusLabel,
    timeline
  };
}

function buyerFileScore(items) {
  const points = items.reduce((total, item) => {
    if (item.status === "Ready") {
      return total + 10;
    }
    if (item.status === "Review") {
      return total + 7;
    }
    if (item.status === "Open") {
      return total + 4;
    }
    if (item.status === "Draft") {
      return total + 3;
    }
    return total;
  }, 0);
  return Math.min(100, Math.round((points / (items.length * 10)) * 100));
}

function buyerFileTimelineEvents({ memo, award, compliance, reviewItems, shortlisted, compared }) {
  const events = [
    {
      date: new Date().toISOString(),
      type: "Generated",
      title: "Buyer file index generated",
      detail: `${projectValue("name", "Project")} | ${projectValue("buyer", "Buyer TBC")}`
    },
    {
      date: new Date().toISOString(),
      type: "Decision",
      title: "Decision memo status",
      detail: `${memo.readiness.score}% - ${memo.readiness.label}`
    },
    {
      date: new Date().toISOString(),
      type: "Award",
      title: "Award handover status",
      detail: `${award.readiness}% - ${award.readinessLabel}`
    },
    {
      date: new Date().toISOString(),
      type: "Compliance",
      title: "Supplier compliance status",
      detail: `${compliance.score}% - ${compliance.statusLabel}`
    },
    ...shortlisted.map((product) => ({
      date: new Date().toISOString(),
      type: "Shortlist",
      title: `${product.brand} ${product.sku}`,
      detail: `${product.name} | ${product.category}`
    })),
    ...compared.map((product) => ({
      date: new Date().toISOString(),
      type: "Compare",
      title: `${product.brand} ${product.sku}`,
      detail: `${product.name} compared for buyer review.`
    })),
    ...state.quotes.map((quote) => ({
      date: quote.updatedAt || quote.savedAt || new Date().toISOString(),
      type: "Quote",
      title: `${quote.supplier} - ${quote.brand} ${quote.sku}`,
      detail: `${quote.status} | ${quoteTotalLabel(quote)} | ${quote.leadTime || "Lead TBC"}`
    })),
    ...state.supplierReplies.map((reply) => ({
      date: reply.updatedAt || reply.savedAt || reply.replyDate || new Date().toISOString(),
      type: "Supplier reply",
      title: `${reply.supplier} - ${reply.brand} ${reply.sku}`,
      detail: `${reply.status} | ${reply.nextAction}`
    })),
    ...state.sourceLeads.map((lead) => ({
      date: lead.updatedAt || lead.savedAt || new Date().toISOString(),
      type: "Source lead",
      title: lead.name,
      detail: `${lead.type} | ${lead.category} | ${lead.status}`
    })),
    ...state.productRequests.map((request) => ({
      date: request.updatedAt || request.savedAt || new Date().toISOString(),
      type: "Product request",
      title: request.part,
      detail: `${request.brand} | ${request.category} | ${request.urgency}`
    })),
    ...reviewItems.slice(0, 8).map((item) => ({
      date: new Date().toISOString(),
      type: item.type,
      title: item.title,
      detail: `[${item.priority}] ${item.detail}`
    }))
  ];

  return events
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 30);
}

function buyerFileStatTemplate(label, value, detail) {
  return `
    <article class="buyer-file-stat">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
      <small>${escapeHtml(detail)}</small>
    </article>
  `;
}

function buyerFileItemTemplate(item) {
  return `
    <article class="buyer-file-item ${escapeHtml(item.status.toLowerCase())}">
      <div>
        <span>${escapeHtml(item.label)}</span>
        <strong>${escapeHtml(item.status)}</strong>
      </div>
      <p>${escapeHtml(item.detail)}</p>
    </article>
  `;
}

function buyerFileTimelineHtml(file) {
  const events = file.timeline.length
    ? file.timeline
    : [{ date: new Date().toISOString(), type: "Ready", title: "No session events", detail: "Add project, shortlist, quotes, replies, or source leads." }];
  return `
    <section class="buyer-file-panel wide">
      <span>Buyer file recommendation</span>
      <p>${escapeHtml(file.statusLabel)}. Export this index with the decision memo, award handover, compliance pack, quote evidence, supplier replies, and source review records.</p>
    </section>
    <section class="buyer-file-event-list">
      ${events.map((event) => `
        <article class="buyer-file-event">
          <span>${escapeHtml(event.type)}</span>
          <strong>${escapeHtml(event.title)}</strong>
          <p>${escapeHtml(event.detail)}</p>
          <small>${escapeHtml(formatAuditDate(event.date))}</small>
        </article>
      `).join("")}
    </section>
  `;
}

function buyerFileText() {
  const file = buyerFileData();
  const checklist = file.items.map((item, index) => `${index + 1}. [${item.status}] ${item.label}: ${item.detail}`).join("\n");
  const timeline = file.timeline.map((event, index) => `${index + 1}. ${formatAuditDate(event.date)} | ${event.type} | ${event.title} - ${event.detail}`).join("\n");

  return `InduScout buyer file / audit index
Prepared on ${formatCopyDate()}

Project:
- Project name: ${projectValue("name", "TBC")}
- Buyer/company: ${projectValue("buyer", "TBC")}
- Buyer contact: ${projectValue("contact", "TBC")}
- Delivery country: ${projectValue("country", "TBC")}
- Target date: ${projectValue("targetDate", "TBC")}

Buyer file status:
- Score: ${file.score}%
- Status: ${file.statusLabel}
- Ready sections: ${file.readyItems} / ${file.items.length}
- Open gaps: ${file.openGaps}

File index:
${checklist}

Timeline / evidence events:
${timeline || "No session evidence events yet."}

Recommended attachments:
- RFQ pack, shortlist CSV/XLSX, and workspace JSON.
- Quote register CSV/XLSX and supplier inbox export.
- Evidence review report, decision memo, award handover, and supplier compliance pack.
- Supplier emails, due-diligence responses, datasheets, certificates, warranty path, and payment validation record.

Project notes:
${projectValue("notes", "No project notes added.")}

InduScout is a local browser discovery and RFQ preparation aid. This buyer file is generated from current browser session data and should be reviewed by the buyer before internal filing or purchase approval.`;
}

function buyerFileSnapshot() {
  const file = buyerFileData();
  return {
    ...createSessionSnapshot(),
    buyerFile: {
      score: file.score,
      statusLabel: file.statusLabel,
      readyItems: file.readyItems,
      openGaps: file.openGaps,
      checklist: file.items,
      timeline: file.timeline,
      generatedText: buyerFileText()
    }
  };
}

async function copyBuyerFileIndex() {
  updateProjectFromFields();
  const text = buyerFileText();
  try {
    await navigator.clipboard.writeText(text);
    if (els.copyBuyerFile) {
      els.copyBuyerFile.textContent = "Buyer file copied";
      setTimeout(() => {
        els.copyBuyerFile.textContent = "Copy buyer file index";
      }, 1400);
    }
  } catch {
    window.prompt("Copy buyer file index", text);
  }
  renderBuyerFile();
}

function downloadBuyerFileHtml() {
  updateProjectFromFields();
  const projectSlug = safeFilenamePart(projectValue("name", ""));
  const date = new Date().toISOString().slice(0, 10);
  const filename = `InduScout-Buyer-File${projectSlug ? `-${projectSlug}` : ""}-${date}.html`;
  downloadFile(filename, buyerFileExportHtml(), "text/html;charset=utf-8");
  renderBuyerFile();
}

function exportBuyerFileJson() {
  updateProjectFromFields();
  const projectSlug = safeFilenamePart(projectValue("name", ""));
  const date = new Date().toISOString().slice(0, 10);
  const filename = projectSlug ? `InduScout-Buyer-File-${projectSlug}-${date}.json` : `InduScout-Buyer-File-${date}.json`;
  downloadFile(filename, JSON.stringify(buyerFileSnapshot(), null, 2), "application/json;charset=utf-8");
  renderBuyerFile();
}

function buyerFileExportHtml() {
  const file = buyerFileData();
  const text = buyerFileText();
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(file.title)}</title>
  <style>
    :root { color-scheme: light; }
    body { margin: 0; font-family: Arial, Helvetica, sans-serif; color: #0f172a; background: #eef6f8; }
    main { max-width: 980px; margin: 0 auto; padding: 32px; }
    header, section { background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; margin-bottom: 14px; padding: 20px; }
    h1 { margin: 6px 0 10px; font-size: 32px; line-height: 1.05; }
    p, pre { font-size: 13px; line-height: 1.55; }
    pre { white-space: pre-wrap; font-family: Arial, Helvetica, sans-serif; margin: 0; }
    .eyebrow { color: #00766f; font-size: 12px; font-weight: 800; text-transform: uppercase; }
    .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin: 14px 0; }
    .stat { border: 1px solid #dbe7ef; border-radius: 8px; padding: 12px; }
    .stat span { display: block; color: #64748b; font-size: 11px; font-weight: 800; text-transform: uppercase; }
    .stat strong { display: block; margin-top: 6px; font-size: 22px; }
    button { background: #0f172a; color: #ffffff; border: 0; border-radius: 6px; padding: 10px 14px; font-weight: 800; }
    @media print { body { background: #ffffff; } main { padding: 0; } button { display: none; } header, section { break-inside: avoid; } }
  </style>
</head>
<body>
  <main>
    <header>
      <div class="eyebrow">InduScout buyer file</div>
      <h1>${escapeHtml(file.title)}</h1>
      <p>Prepared on ${escapeHtml(formatCopyDate())}. Use this as an audit-ready index for the sourcing record.</p>
      <button onclick="window.print()">Save as PDF</button>
    </header>
    <div class="stats">
      <div class="stat"><span>File score</span><strong>${escapeHtml(`${file.score}%`)}</strong></div>
      <div class="stat"><span>Ready items</span><strong>${escapeHtml(file.readyItems)}</strong></div>
      <div class="stat"><span>Open gaps</span><strong>${escapeHtml(file.openGaps)}</strong></div>
      <div class="stat"><span>Timeline</span><strong>${escapeHtml(file.timeline.length)}</strong></div>
    </div>
    <section>
      <pre>${escapeHtml(text)}</pre>
    </section>
  </main>
</body>
</html>`;
}

function formatAuditDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Date TBC";
  }
  return date.toISOString().slice(0, 10);
}

function productTemplate(product) {
  const score = product[state.priority];
  const isShortlisted = state.shortlist.includes(product.id);
  const isCompared = state.compare.includes(product.id);
  const confidence = confidenceForProduct(product);
  const sourceLinks = product.sources.map(sourceLinkTemplate).join("");
  const applicationList = product.applications.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  const specList = product.specs.map((spec) => `<li>${escapeHtml(spec)}</li>`).join("");
  const certs = product.certifications.length ? product.certifications.join(", ") : "Check";

  return `
    <article class="product-card">
      <div class="product-main">
        <div class="product-top">
          <div>
            <h3>${escapeHtml(product.name)}</h3>
            <div class="sku">${escapeHtml(product.brand)} &middot; ${escapeHtml(product.sku)} &middot; ${escapeHtml(product.category)}</div>
          </div>
          <div class="badge-stack">
            <span class="badge ${product.verified ? "" : "amber"}">${product.verified ? "Verified signal" : "Needs verification"}</span>
            <span class="confidence-badge ${confidence.level}">${escapeHtml(confidence.label)}</span>
          </div>
        </div>
        <p class="description">${escapeHtml(product.description)}</p>
        <div class="product-flags">
          <span>${escapeHtml(product.family)}</span>
          <span>Lifecycle: ${escapeHtml(product.lifecycle)}</span>
          <span>Certs: ${escapeHtml(certs)}</span>
          <span>Trust: ${escapeHtml(confidence.short)}</span>
        </div>
        <ul class="spec-list">
          ${specList}
        </ul>
        <ul class="application-list" aria-label="Common applications">
          ${applicationList}
        </ul>
        <div class="source-links">${sourceLinks}</div>
      </div>
      <div class="product-side">
        <div class="score">
          <span>${escapeHtml(priorityLabel())} fit</span>
          <strong>${score}</strong>
          <div class="bar" aria-hidden="true"><i style="width:${score}%"></i></div>
        </div>
        <div class="meta-list">
          <span>Lead time <b>${escapeHtml(product.lead)}</b></span>
          <span>MOQ <b>${escapeHtml(product.moq)}</b></span>
          <span>Datasheet <b>${product.datasheet ? "Yes" : "Check"}</b></span>
        </div>
        <div class="card-actions">
          <button class="detail-action" type="button" data-detail="${escapeHtml(product.id)}">Details / RFQ</button>
          <button class="${isShortlisted ? "remove-action" : ""}" type="button" data-add="${escapeHtml(product.id)}">${isShortlisted ? "Remove shortlist" : "Add to shortlist"}</button>
          <button class="secondary-action" type="button" data-compare="${escapeHtml(product.id)}">${isCompared ? "In compare" : "Compare"}</button>
          <a class="button-link ghost-button" href="${safeHref(product.sources[0]?.url)}" target="_blank" rel="noreferrer">Open primary source</a>
        </div>
      </div>
    </article>
  `;
}

function sourceLinkTemplate(source) {
  return `
    <a href="${safeHref(source.url)}" target="_blank" rel="noreferrer" title="${escapeHtml(source.action)}">
      <span>${escapeHtml(source.type)}</span>
      ${escapeHtml(source.name)}
    </a>
  `;
}

function renderCategories() {
  els.categoryGrid.innerHTML = categoryTaxonomy
    .map((category) => {
      const productCount = products.filter((product) => product.category === category.name).length;
      const focus = category.focus.map((item) => `<li>${escapeHtml(item)}</li>`).join("");

      return `
        <article class="category-card">
          <span>${productCount} beta records</span>
          <h3>${escapeHtml(category.name)}</h3>
          <p>${escapeHtml(category.summary)}</p>
          <ul>${focus}</ul>
          <button type="button" data-category-select="${escapeHtml(category.name)}">View matches</button>
        </article>
      `;
    })
    .join("");
}

function renderSources() {
  els.sourceGrid.innerHTML = sourceChannels
    .map(
      (source) => `
        <article class="source-card">
          <span>${escapeHtml(source.type)}</span>
          <h3>${escapeHtml(source.title)}</h3>
          <p>${escapeHtml(source.body)}</p>
          <a href="${safeHref(source.url)}" target="_blank" rel="noreferrer">Explore source</a>
        </article>
      `
    )
    .join("");
}

function renderSourceDirectory() {
  els.sourceDirectory.innerHTML = sourceDirectory
    .map(
      (source) => {
        const passport = sourceTrustPassport(source);
        return `
        <article class="directory-card">
          <div>
            <span>${escapeHtml(source.type)}</span>
            <h3>${escapeHtml(source.name)}</h3>
          </div>
          <p>${escapeHtml(source.bestFor)}</p>
          <div class="passport-panel">
            <strong>${escapeHtml(passport.role)}</strong>
            <span>${escapeHtml(passport.verify[0])}</span>
            <small>${escapeHtml(passport.risk)}</small>
          </div>
          <small>${escapeHtml(source.regions.join(", "))}</small>
          <div class="directory-actions">
            <button type="button" data-copy-directory-passport="${escapeHtml(source.name)}">Copy checklist</button>
            <a href="${safeHref(source.url)}" target="_blank" rel="noreferrer">Open</a>
          </div>
        </article>
      `;
      }
    )
    .join("");
}

function renderSourceIntake() {
  if (!els.sourceIntakeSummary || !els.sourceLeadList) {
    return;
  }

  const total = state.sourceLeads.length;
  const withEvidence = state.sourceLeads.filter((lead) => lead.evidenceUrl || lead.website).length;
  const authorizedClaims = state.sourceLeads.filter((lead) => lead.status === "Authorized claim").length;
  const needsReview = state.sourceLeads.filter((lead) => ["New lead", "Needs verification"].includes(lead.status)).length;

  els.sourceIntakeSummary.innerHTML = `
    <article><span>Total leads</span><strong>${total}</strong><small>Saved locally</small></article>
    <article><span>Evidence links</span><strong>${withEvidence}</strong><small>Website or proof supplied</small></article>
    <article><span>Authorized claims</span><strong>${authorizedClaims}</strong><small>Needs document review</small></article>
    <article><span>Review queue</span><strong>${needsReview}</strong><small>New or unverified leads</small></article>
  `;

  if (els.sourceLeadRegisterStatus) {
    els.sourceLeadRegisterStatus.textContent = total ? `${total} saved source ${total === 1 ? "lead" : "leads"} in this browser` : "Stored locally in this browser";
  }

  if (!total) {
    els.sourceLeadList.innerHTML = `
      <div class="empty-state source-lead-empty">
        Save supplier or source leads here before adding them to the public catalog. Keep authorization and evidence notes attached to each lead.
      </div>
    `;
    renderBuyerWorkspace();
    renderEvidenceReviewBoard();
    renderSupplierScorecard();
    return;
  }

  els.sourceLeadList.innerHTML = state.sourceLeads.map(sourceLeadCardTemplate).join("");
  renderBuyerWorkspace();
  renderEvidenceReviewBoard();
  renderSupplierScorecard();
}

function sourceLeadCardTemplate(lead) {
  return `
    <article class="source-lead-card">
      <div>
        <span>${escapeHtml(lead.type)} &middot; ${escapeHtml(lead.category)}</span>
        <h4>${escapeHtml(lead.name)}</h4>
        <p>${escapeHtml(lead.notes || "No verification notes added.")}</p>
        <small>${escapeHtml(lead.region || "Region TBC")} &middot; ${escapeHtml(lead.contact || "Contact TBC")}</small>
      </div>
      <strong class="source-lead-status">${escapeHtml(lead.status)}</strong>
      <div class="source-lead-card-actions">
        <button type="button" data-load-source-lead="${escapeHtml(lead.id)}">Load</button>
        <button type="button" data-copy-source-lead="${escapeHtml(lead.id)}">Copy packet</button>
        <button type="button" data-remove-source-lead="${escapeHtml(lead.id)}">Remove</button>
      </div>
    </article>
  `;
}

function sourceLeadSnapshot() {
  const existing = state.sourceLeads.find((lead) => lead.id === els.sourceLeadId?.value);
  const name = cleanText(els.sourceLeadName?.value || "Source TBC", 180);
  return sanitizeSourceLead({
    id: cleanText(els.sourceLeadId?.value || `${Date.now()}-${safeFilenamePart(name) || "source-lead"}`, 90),
    savedAt: existing?.savedAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    name,
    website: els.sourceLeadWebsite?.value || "",
    type: els.sourceLeadType?.value || "Distributor",
    category: els.sourceLeadCategory?.value || "Multiple categories",
    region: els.sourceLeadRegion?.value || "",
    evidenceUrl: els.sourceLeadEvidence?.value || "",
    contact: els.sourceLeadContact?.value || "",
    status: els.sourceLeadStatus?.value || "New lead",
    notes: els.sourceLeadNotes?.value || ""
  });
}

function hydrateSourceLeadForm(lead = {}) {
  if (!els.sourceLeadForm) {
    return;
  }
  els.sourceLeadId.value = lead.id || "";
  els.sourceLeadName.value = lead.name || "";
  els.sourceLeadWebsite.value = lead.website || "";
  els.sourceLeadType.value = lead.type || "Distributor";
  els.sourceLeadCategory.value = lead.category || "Multiple categories";
  els.sourceLeadRegion.value = lead.region || "";
  els.sourceLeadEvidence.value = lead.evidenceUrl || "";
  els.sourceLeadContact.value = lead.contact || "";
  els.sourceLeadStatus.value = lead.status || "New lead";
  els.sourceLeadNotes.value = lead.notes || "";
}

function saveSourceLead() {
  const lead = sourceLeadSnapshot();
  if (!lead || !lead.name || lead.name === "Source TBC") {
    els.saveSourceLead.textContent = "Add source first";
    setTimeout(() => {
      els.saveSourceLead.textContent = "Save source lead";
    }, 1200);
    return;
  }

  state.sourceLeads = [lead, ...state.sourceLeads.filter((item) => item.id !== lead.id)].slice(0, 120);
  saveSourceLeads();
  hydrateSourceLeadForm(lead);
  renderSourceIntake();
  renderGovernanceCenter();
  els.saveSourceLead.textContent = "Source lead saved";
  setTimeout(() => {
    els.saveSourceLead.textContent = "Save source lead";
  }, 1200);
}

function loadSourceLead(id) {
  const lead = state.sourceLeads.find((item) => item.id === id);
  if (!lead) {
    return;
  }
  hydrateSourceLeadForm(lead);
  els.sourceLeadForm?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function removeSourceLead(id) {
  state.sourceLeads = state.sourceLeads.filter((lead) => lead.id !== id);
  saveSourceLeads();
  renderSourceIntake();
  renderGovernanceCenter();
}

function clearSourceLeadForm() {
  hydrateSourceLeadForm();
}

function clearSourceLeads() {
  state.sourceLeads = [];
  saveSourceLeads();
  clearSourceLeadForm();
  renderSourceIntake();
  renderGovernanceCenter();
}

async function copyCurrentSourceLead() {
  const lead = sourceLeadSnapshot();
  await copySourceLeadText(sourceLeadReviewText(lead), els.copySourceLead, "Packet copied", "Copy review packet");
}

async function copySavedSourceLead(id, triggerButton) {
  const lead = state.sourceLeads.find((item) => item.id === id);
  if (!lead) {
    return;
  }
  await copySourceLeadText(sourceLeadReviewText(lead), triggerButton, "Packet copied", "Copy packet");
}

async function copySourceLeadText(text, triggerButton, copiedLabel, defaultLabel) {
  try {
    await navigator.clipboard.writeText(text);
    if (triggerButton) {
      triggerButton.textContent = copiedLabel;
      setTimeout(() => {
        triggerButton.textContent = defaultLabel;
      }, 1400);
    }
  } catch {
    window.prompt("Copy source review packet", text);
  }
}

function sourceLeadReviewText(lead) {
  return `InduScout supplier/source review packet
Prepared on ${formatCopyDate()}

Source name: ${lead.name}
Source type: ${lead.type}
Primary category: ${lead.category}
Regions served: ${lead.region || "TBC"}
Website/profile: ${lead.website || "TBC"}
Evidence or authorization URL: ${lead.evidenceUrl || "TBC"}
Review status: ${lead.status}
Submitter/contact: ${lead.contact || "TBC"}

Verification notes:
${lead.notes || "No verification notes added."}

Review checklist:
- Confirm company identity, website ownership, and contact path.
- Confirm whether this is an OEM, authorized distributor, marketplace, RFQ network, surplus seller, data directory, or local supplier.
- Request line card, authorization proof, certificates, warranty path, and official buying or RFQ links where relevant.
- Confirm product categories, brands carried, regions served, currencies, payment terms, delivery terms, and support capability.
- Check whether this source should become a catalog source, a supplier passport entry, or a watchlist item.

InduScout is a discovery and RFQ preparation aid. Supplier/source leads require review before public catalog inclusion.`;
}

function sourceLeadExportTable() {
  const headers = [
    "Source Name",
    "Source Type",
    "Category",
    "Regions Served",
    "Website",
    "Evidence URL",
    "Review Status",
    "Contact",
    "Notes",
    "Saved At",
    "Updated At"
  ];
  const rows = state.sourceLeads.map((lead) => [
    lead.name,
    lead.type,
    lead.category,
    lead.region,
    lead.website,
    lead.evidenceUrl,
    lead.status,
    lead.contact,
    lead.notes,
    lead.savedAt,
    lead.updatedAt
  ]);
  return { headers, rows };
}

function exportSourceLeadCsv() {
  const table = sourceLeadExportTable();
  if (!table.rows.length) {
    els.exportSourceLeadCsv.textContent = "Add leads first";
    setTimeout(() => {
      els.exportSourceLeadCsv.textContent = "Export CSV";
    }, 1200);
    return;
  }
  const csv = [table.headers, ...table.rows].map((row) => row.map(csvEscape).join(",")).join("\r\n");
  downloadFile(`InduScout-Source-Intake-${new Date().toISOString().slice(0, 10)}.csv`, `\ufeff${csv}`, "text/csv;charset=utf-8");
}

function exportSourceLeadXlsx() {
  const table = sourceLeadExportTable();
  if (!table.rows.length) {
    els.exportSourceLeadXlsx.textContent = "Add leads first";
    setTimeout(() => {
      els.exportSourceLeadXlsx.textContent = "Export XLSX";
    }, 1200);
    return;
  }
  downloadFile(
    `InduScout-Source-Intake-${new Date().toISOString().slice(0, 10)}.xlsx`,
    createXlsxWorkbook(table.headers, table.rows, "Source Intake", "InduScout Source Intake"),
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
}

function renderQualityDashboard() {
  const totalProducts = products.length || 1;
  const sourceLinkCount = products.reduce((total, product) => total + product.sources.length, 0);
  const verifiedProducts = products.filter((product) => product.verified).length;
  const datasheetProducts = products.filter((product) => product.datasheet).length;
  const confidenceCounts = products.reduce(
    (counts, product) => {
      counts[confidenceForProduct(product).level] += 1;
      return counts;
    },
    { high: 0, standard: 0, review: 0 }
  );
  const sourceTypesUsed = new Set(products.flatMap((product) => product.sources.map((source) => source.type))).size;
  const averageSources = products.length ? (sourceLinkCount / products.length).toFixed(1) : "0.0";
  const stats = [
    {
      label: "Verified records",
      value: verifiedProducts,
      meta: `${percentage(verifiedProducts, totalProducts)}% of catalog`
    },
    {
      label: "Datasheet coverage",
      value: datasheetProducts,
      meta: `${percentage(datasheetProducts, totalProducts)}% with datasheet signal`
    },
    {
      label: "High confidence",
      value: confidenceCounts.high,
      meta: `${confidenceCounts.standard} standard, ${confidenceCounts.review} review`
    },
    {
      label: "Source depth",
      value: averageSources,
      meta: `${sourceLinkCount} links across ${sourceTypesUsed} source types`
    }
  ];

  els.qualityStats.innerHTML = stats
    .map(
      (stat) => `
        <article class="quality-stat">
          <span>${escapeHtml(stat.label)}</span>
          <strong>${escapeHtml(stat.value)}</strong>
          <small>${escapeHtml(stat.meta)}</small>
        </article>
      `
    )
    .join("");

  const maxCategoryCount = Math.max(...categories.map((category) => products.filter((product) => product.category === category).length), 1);
  els.qualityCategoryGrid.innerHTML = categories
    .map((category) => {
      const categoryProducts = products.filter((product) => product.category === category);
      const verified = categoryProducts.filter((product) => product.verified).length;
      const datasheets = categoryProducts.filter((product) => product.datasheet).length;
      const high = categoryProducts.filter((product) => confidenceForProduct(product).level === "high").length;
      const width = percentage(categoryProducts.length, maxCategoryCount);

      return `
        <article class="quality-category-row">
          <div>
            <strong>${escapeHtml(category)}</strong>
            <span>${categoryProducts.length} records &middot; ${high} high confidence</span>
          </div>
          <div class="quality-bar" aria-hidden="true"><i style="width:${width}%"></i></div>
          <small>${verified}/${categoryProducts.length} verified &middot; ${datasheets}/${categoryProducts.length} datasheets</small>
        </article>
      `;
    })
    .join("");

  const reviewItems = products
    .filter((product) => {
      const confidence = confidenceForProduct(product);
      return confidence.level === "review" || !product.datasheet || product.sources.length < 3;
    })
    .slice(0, 8);

  els.qualityReviewList.innerHTML = reviewItems.length
    ? reviewItems
        .map((product) => {
          const gaps = qualityGaps(product);
          return `
            <article class="quality-review-row">
              <div>
                <strong>${escapeHtml(product.brand)} ${escapeHtml(product.sku)}</strong>
                <span>${escapeHtml(product.category)} &middot; ${escapeHtml(product.name)}</span>
              </div>
              <small>${escapeHtml(gaps.join(", "))}</small>
              <a href="index.html?q=${encodeURIComponent(`${product.brand} ${product.sku}`)}#finder">Open</a>
            </article>
          `;
        })
        .join("")
    : '<div class="quality-empty">No immediate quality gaps in the current catalog view.</div>';
}

function qualityGaps(product) {
  const gaps = [];
  if (!product.verified) {
    gaps.push("verify source");
  }
  if (!product.datasheet) {
    gaps.push("add datasheet signal");
  }
  if (product.sources.length < 3) {
    gaps.push("add source depth");
  }
  if (!product.sources.some((source) => source.type === "OEM")) {
    gaps.push("add OEM path");
  }
  return gaps.length ? gaps : ["review confidence"];
}

function percentage(value, total) {
  return Math.round((value / Math.max(total, 1)) * 100);
}

function confidenceForProduct(product) {
  const hasStrongSource = product.sources.some((source) => ["OEM", "Distributor"].includes(source.type));
  const hasMultipleSources = product.sources.length >= 3;

  if (!product.verified) {
    return {
      level: "review",
      label: "Review required",
      short: "Needs source verification",
      reason: "Source signal, seller path, certification, or alternate validity needs additional buyer checks."
    };
  }

  if (product.verified && product.datasheet && hasStrongSource) {
    return {
      level: "high",
      label: "High confidence",
      short: "Verified source + datasheet",
      reason: "Verified source signal, datasheet availability, and OEM or distributor path are present."
    };
  }

  if (product.verified || (product.datasheet && hasMultipleSources)) {
    return {
      level: "standard",
      label: "Standard confidence",
      short: "Useful discovery record",
      reason: "Several procurement signals are present, but buyer confirmation is still required."
    };
  }

  return {
    level: "review",
    label: "Review required",
    short: "Needs buyer verification",
    reason: "Source path, datasheet, supplier status, or alternate validity needs additional checks."
  };
}

function confidenceForSource(source) {
  if (source.type === "OEM" || source.type === "Distributor") {
    return { level: "high", label: "Primary trust path" };
  }

  if (source.type === "Data" || source.type === "RFQ") {
    return { level: "standard", label: "Discovery path" };
  }

  return { level: "review", label: "Verify seller terms" };
}

function sourceTrustPassport(source) {
  const passports = {
    OEM: {
      role: "Official data authority",
      verify: [
        "Confirm exact model, suffix, configuration, datasheet revision, lifecycle, and authorized channel guidance.",
        "Use OEM content as the primary technical reference before approving alternates or supplier quotes.",
        "Check certificate, manual, warranty, and regional support path before purchase."
      ],
      risk: "OEM pages may not show live stock or local commercial terms."
    },
    Distributor: {
      role: "Primary buying path",
      verify: [
        "Confirm authorization, stock, unit price, offer validity, lead time, warranty route, invoice, and delivery terms.",
        "Check that the exact manufacturer part number and suffix match the buyer requirement.",
        "Request certificate, datasheet, country of origin, and return/warranty conditions when needed."
      ],
      risk: "Regional stock and authorization can vary by country and product line."
    },
    Marketplace: {
      role: "Broad supplier discovery path",
      verify: [
        "Verify seller identity, business registration, transaction history, product authenticity, and trade terms.",
        "Request photos, datasheets, certificate evidence, warranty terms, and exact model confirmation.",
        "Use secure payment, clear Incoterms, and buyer protection for first transactions."
      ],
      risk: "Higher seller-legitimacy, counterfeit, grey-market, and warranty risk."
    },
    RFQ: {
      role: "Quote-first sourcing path",
      verify: [
        "Confirm supplier capability, product scope, lead time, commercial terms, and evidence behind the quote.",
        "Ask for exact part number, datasheet, certificate path, warranty, and alternates with technical justification.",
        "Compare at least two quotes when project value, lead time, or criticality is high."
      ],
      risk: "Quote quality depends on supplier evidence and buyer specification clarity."
    },
    Surplus: {
      role: "Urgent or obsolete spare path",
      verify: [
        "Confirm condition, revision, firmware, packaging, test status, warranty, and return rights.",
        "Ask whether the part is new, refurbished, repaired, used, or surplus stock.",
        "Match serial, firmware, voltage, and installed-equipment compatibility before approval."
      ],
      risk: "Obsolete stock may have limited warranty, no OEM support, or revision mismatch."
    },
    Data: {
      role: "Specification discovery path",
      verify: [
        "Use as an early comparison aid, then confirm final data against the OEM or authorized source.",
        "Check dimensions, standards, alternates, datasheet date, and whether the record is current.",
        "Do not treat data-directory pages as a buying or warranty path."
      ],
      risk: "Data indexes can be incomplete, stale, or detached from stock availability."
    },
    MRO: {
      role: "Maintenance procurement path",
      verify: [
        "Confirm brand authenticity, stock, pack quantity, delivery timing, account terms, and return route.",
        "Check whether the item is equivalent, generic, or genuine branded stock.",
        "Request datasheet or certificate evidence for critical plant equipment."
      ],
      risk: "MRO catalogs can mix OEM, equivalent, and generic replacement options."
    }
  };

  return passports[source.type] || {
    role: "Discovery support path",
    verify: [
      "Confirm supplier identity, exact part number, stock, datasheet, warranty, price, lead time, and delivery terms.",
      "Check whether the source is official, authorized, marketplace, RFQ, surplus, or data-only.",
      "Validate technical compatibility before treating alternates as acceptable."
    ],
    risk: "Source role is not fully classified yet, so buyer verification is required."
  };
}

function openProductDetail(id) {
  const product = products.find((item) => item.id === id);
  if (!product) {
    return;
  }

  closeShortlist();
  state.activeProductId = id;
  els.productDetailContent.innerHTML = productDetailTemplate(product);
  els.productDetail.classList.add("open");
  els.productDetail.setAttribute("aria-hidden", "false");
  els.scrim.classList.add("open");
}

function productDetailTemplate(product) {
  const score = product[state.priority];
  const note = state.notes[product.id] || "";
  const isShortlisted = state.shortlist.includes(product.id);
  const isCompared = state.compare.includes(product.id);
  const confidence = confidenceForProduct(product);
  const certs = product.certifications.length ? product.certifications.join(", ") : "Check with supplier";
  const sourceActions = product.sources.map((source, index) => detailSourceTemplate(source, index, product.id)).join("");
  const specs = product.specs.map((spec) => `<li>${escapeHtml(spec)}</li>`).join("");
  const applications = product.applications.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  const alternates = product.alternatives.map((item) => `<li>${escapeHtml(item)}</li>`).join("");

  return `
    <article class="detail-product">
      <div class="detail-title">
        <span>${escapeHtml(product.category)}</span>
        <h3>${escapeHtml(product.brand)} ${escapeHtml(product.sku)}</h3>
        <p>${escapeHtml(product.name)}</p>
      </div>
      <div class="detail-confidence ${confidence.level}">
        <span>${escapeHtml(confidence.label)}</span>
        <strong>${escapeHtml(confidence.reason)}</strong>
      </div>
      <div class="verification-note">
        <strong>Verify before buying</strong>
        <span>Confirm exact part number, compatibility, datasheet revision, certificate availability, warranty path, stock, pricing, and seller terms with the supplier.</span>
      </div>
      <div class="detail-score">
        <div>
          <span>${escapeHtml(priorityLabel())} fit</span>
          <strong>${score}</strong>
        </div>
        <div class="bar" aria-hidden="true"><i style="width:${score}%"></i></div>
      </div>
      <p class="detail-description">${escapeHtml(product.description)}</p>
      <div class="detail-actions">
        <button class="${isShortlisted ? "remove-action" : ""}" type="button" data-detail-add="${escapeHtml(product.id)}">${isShortlisted ? "Remove shortlist" : "Add to shortlist"}</button>
        <button class="secondary-action" type="button" data-detail-compare="${escapeHtml(product.id)}">${isCompared ? "In compare" : "Compare"}</button>
      </div>
      <div class="detail-facts">
        <div><span>Family</span><strong>${escapeHtml(product.family)}</strong></div>
        <div><span>Lead time</span><strong>${escapeHtml(product.lead)}</strong></div>
        <div><span>MOQ</span><strong>${escapeHtml(product.moq)}</strong></div>
        <div><span>Lifecycle</span><strong>${escapeHtml(product.lifecycle)}</strong></div>
        <div><span>Datasheet</span><strong>${product.datasheet ? "Available" : "Check"}</strong></div>
        <div><span>Certifications</span><strong>${escapeHtml(certs)}</strong></div>
        <div><span>Confidence</span><strong>${escapeHtml(confidence.short)}</strong></div>
      </div>
      <div class="brief-builder">
        <div>
          <h4>Procurement brief</h4>
          <p>Copy a buyer-ready internal note with fit score, source paths, alternates, and verification checks.</p>
        </div>
        <button type="button" data-copy-brief="${escapeHtml(product.id)}">Copy procurement brief</button>
      </div>
      <div class="detail-section">
        <h4>Specifications</h4>
        <ul class="detail-pills">${specs}</ul>
      </div>
      <div class="detail-section">
        <h4>Applications</h4>
        <ul class="detail-pills">${applications}</ul>
      </div>
      <div class="detail-section">
        <h4>Alternates</h4>
        <ul class="detail-pills">${alternates}</ul>
      </div>
      <div class="detail-section">
        <h4>Source actions</h4>
        <div class="detail-sources">${sourceActions}</div>
      </div>
      <form class="rfq-builder" id="rfqBuilder">
        <div class="rfq-heading">
          <h4>RFQ request pack</h4>
          <p>Fill what you know, then copy a clean request for email or supplier portals. Ask the supplier to confirm all commercial and technical details.</p>
        </div>
        <div class="rfq-grid">
          <label>Quantity
            <input id="rfqQuantity" type="text" value="${escapeHtml(defaultQuantity(product.moq))}" autocomplete="off">
          </label>
          <label>Delivery country
            <input id="rfqCountry" type="text" value="${escapeHtml(projectValue("country", ""))}" placeholder="e.g. UAE, India, USA" autocomplete="off">
          </label>
          <label>Target date
            <input id="rfqDate" type="date" value="${escapeHtml(projectValue("targetDate", ""))}">
          </label>
          <label>Urgency
            <select id="rfqUrgency">
              <option>Standard sourcing</option>
              <option>Urgent breakdown</option>
              <option>Project tender</option>
              <option>Budgetary quote</option>
            </select>
          </label>
        </div>
        <label class="rfq-check"><input id="rfqAlternates" type="checkbox" checked> Accept equivalent alternates if exact part is unavailable</label>
        <label class="note-field">Buyer notes
          <textarea id="buyerNotes" data-buyer-note="${escapeHtml(product.id)}" rows="5" placeholder="Add project, compatibility, certificate, or supplier instructions">${escapeHtml(note)}</textarea>
        </label>
        <div class="rfq-copy-actions">
          <button type="button" data-copy-rfq="${escapeHtml(product.id)}">Copy RFQ request</button>
          <button class="secondary-copy" type="button" data-copy-supplier="${escapeHtml(product.id)}">Copy supplier email</button>
          <button class="muted-copy" type="button" data-copy-brief="${escapeHtml(product.id)}">Copy procurement brief</button>
          <button class="muted-copy" type="button" data-start-quote="${escapeHtml(product.id)}">Track quote</button>
        </div>
      </form>
      <form class="data-update-builder">
        <div class="rfq-heading">
          <h4>Report or update product data</h4>
          <p>Use this when a product record has a missing source, outdated lead time, wrong alternate, or certification concern.</p>
        </div>
        <div class="rfq-grid">
          <label>Issue type
            <select id="dataIssueType">
              <option>Missing buying source</option>
              <option>Wrong or outdated specification</option>
              <option>Datasheet or certificate issue</option>
              <option>Alternate product concern</option>
              <option>Supplier verification concern</option>
            </select>
          </label>
          <label>Your contact
            <input id="dataReporterContact" type="text" placeholder="Optional email or company" autocomplete="off">
          </label>
        </div>
        <label class="note-field">Suggested correction or evidence
          <textarea id="dataCorrection" rows="4" placeholder="Paste corrected source link, datasheet note, supplier name, or issue details"></textarea>
        </label>
        <button type="button" data-copy-update="${escapeHtml(product.id)}">Copy data update request</button>
      </form>
    </article>
  `;
}

function detailSourceTemplate(source, index, productId) {
  const confidence = confidenceForSource(source);
  const passport = sourceTrustPassport(source);
  return `
    <article class="detail-source-card ${escapeHtml(confidence.level)}">
      <a href="${safeHref(source.url)}" target="_blank" rel="noreferrer">
        <span>${escapeHtml(source.type)}</span>
        <strong>${escapeHtml(source.name)}</strong>
        <small>${escapeHtml(source.action)} &middot; ${escapeHtml(source.region)} &middot; ${escapeHtml(confidence.label)}</small>
      </a>
      <div class="source-passport-mini">
        <strong>${escapeHtml(passport.role)}</strong>
        <span>${escapeHtml(passport.verify[0])}</span>
      </div>
      <button type="button" data-source-product="${escapeHtml(productId)}" data-source-index="${index}" data-copy-source-passport>Copy trust checklist</button>
    </article>
  `;
}

function toggleCompare(id) {
  if (state.compare.includes(id)) {
    state.compare = state.compare.filter((item) => item !== id);
  } else {
    if (state.compare.length >= 4) {
      state.compare.shift();
    }
    state.compare.push(id);
  }

  renderCompare();
  render();
}

function renderCompare() {
  const selected = state.compare.map((id) => products.find((product) => product.id === id)).filter(Boolean);
  setText(els.compareCount, selected.length);
  setText(
    els.compareSummary,
    selected.length
      ? `${selected.length} ${selected.length === 1 ? "product" : "products"} selected for comparison`
      : "No products selected for comparison"
  );

  if (!selected.length) {
    els.compareGrid.innerHTML = `
      <div class="empty-state compare-empty">
        Use the Compare button on product cards to build a side-by-side procurement view.
      </div>
    `;
    return;
  }

  els.compareGrid.innerHTML = selected.map(compareTemplate).join("");
}

function compareTemplate(product) {
  const score = product[state.priority];
  const sourceNames = product.sources.map((source) => `${source.type}: ${source.name}`).join(", ");
  const certs = product.certifications.length ? product.certifications.join(", ") : "Check";

  return `
    <article class="compare-card">
      <div class="compare-card-head">
        <div>
          <span>${escapeHtml(product.category)}</span>
          <h3>${escapeHtml(product.brand)} ${escapeHtml(product.sku)}</h3>
        </div>
        <button type="button" data-remove-compare="${escapeHtml(product.id)}" aria-label="Remove ${escapeHtml(product.name)} from comparison">&times;</button>
      </div>
      <p>${escapeHtml(product.name)}</p>
      <div class="compare-score">
        <span>${escapeHtml(priorityLabel())} fit</span>
        <strong>${score}</strong>
        <div class="bar" aria-hidden="true"><i style="width:${score}%"></i></div>
      </div>
      <dl class="compare-list">
        <div><dt>Lead time</dt><dd>${escapeHtml(product.lead)}</dd></div>
        <div><dt>MOQ</dt><dd>${escapeHtml(product.moq)}</dd></div>
        <div><dt>Lifecycle</dt><dd>${escapeHtml(product.lifecycle)}</dd></div>
        <div><dt>Datasheet</dt><dd>${product.datasheet ? "Yes" : "Check"}</dd></div>
        <div><dt>Certs</dt><dd>${escapeHtml(certs)}</dd></div>
        <div><dt>Sources</dt><dd>${escapeHtml(sourceNames)}</dd></div>
        <div><dt>Alternates</dt><dd>${escapeHtml(product.alternatives.join(", "))}</dd></div>
      </dl>
      <a class="button-link ghost-button" href="${safeHref(product.sources[0]?.url)}" target="_blank" rel="noreferrer">Open primary source</a>
    </article>
  `;
}

function specRequirementInputs() {
  return [
    els.specApplication,
    els.specMustHave,
    els.specCertifications,
    els.specSourceRequirement,
    els.specCriticality
  ].filter(Boolean);
}

function defaultSpecRequirements() {
  return {
    application: "",
    mustHave: "",
    certifications: "",
    sourceRequirement: "any",
    criticality: "Standard sourcing"
  };
}

function hydrateSpecRequirementFields() {
  if (!els.specForm) {
    return;
  }
  const requirements = { ...defaultSpecRequirements(), ...state.specRequirements };
  els.specApplication.value = requirements.application;
  els.specMustHave.value = requirements.mustHave;
  els.specCertifications.value = requirements.certifications;
  els.specSourceRequirement.value = requirements.sourceRequirement;
  els.specCriticality.value = requirements.criticality;
}

function specRequirementsFromFields() {
  return sanitizeSpecRequirements({
    application: els.specApplication?.value || "",
    mustHave: els.specMustHave?.value || "",
    certifications: els.specCertifications?.value || "",
    sourceRequirement: els.specSourceRequirement?.value || "any",
    criticality: els.specCriticality?.value || "Standard sourcing"
  });
}

function updateSpecRequirementsFromFields() {
  state.specRequirements = specRequirementsFromFields();
  saveSpecRequirements();
  renderSpecMatchDesk();
}

function saveSpecRequirementsFromFields() {
  updateSpecRequirementsFromFields();
  if (els.saveSpecRequirements) {
    els.saveSpecRequirements.textContent = "Requirements saved";
    setTimeout(() => {
      els.saveSpecRequirements.textContent = "Save requirements";
    }, 1200);
  }
}

function resetSpecRequirements() {
  state.specRequirements = defaultSpecRequirements();
  saveSpecRequirements();
  hydrateSpecRequirementFields();
  renderSpecMatchDesk();
}

function renderSpecMatchDesk(prefilteredProducts) {
  if (!els.specMatchStats || !els.specMatchSummary || !els.specMatchGrid) {
    return;
  }

  const matrix = specMatchData(prefilteredProducts);
  els.specMatchSummary.textContent = matrix.title;
  els.specMatchStats.innerHTML = [
    specStatTemplate("Products scored", matrix.cards.length, matrix.scopeLabel),
    specStatTemplate("Best fit", matrix.top ? `${matrix.top.score}%` : "TBC", matrix.top ? `${matrix.top.product.brand} ${matrix.top.product.sku}` : "Add requirements or products"),
    specStatTemplate("Strong fits", matrix.strongFits, "Products at 80% or higher"),
    specStatTemplate("Open gaps", matrix.gapCount, matrix.gapCount ? "Technical checks to close" : "No visible gaps")
  ].join("");

  if (!matrix.cards.length) {
    els.specMatchGrid.innerHTML = `
      <div class="empty-state spec-empty">
        Add products to Compare or Shortlist, or use Finder filters, then enter buyer requirements to build a spec match matrix.
      </div>
    `;
    return;
  }

  els.specMatchGrid.innerHTML = matrix.cards.map(specMatchCardTemplate).join("");
}

function specMatchData(prefilteredProducts) {
  const requirements = state.specRequirements || defaultSpecRequirements();
  const candidates = specCandidateProducts(prefilteredProducts);
  const cards = candidates
    .map((product) => scoreSpecProduct(product, requirements))
    .sort((a, b) => b.score - a.score || b.product[state.priority] - a.product[state.priority])
    .slice(0, 12);
  const top = cards[0] || null;
  const strongFits = cards.filter((card) => card.score >= 80).length;
  const gapCount = cards.reduce((total, card) => total + card.gaps.length, 0);
  const requirementLabel = specRequirementsLabel(requirements);
  const scopeLabel = specScopeLabel();
  const title = top
    ? `${top.product.brand} ${top.product.sku} leads technical fit`
    : "Spec matrix needs buyer requirements";

  return { requirements, candidates, cards, top, strongFits, gapCount, requirementLabel, scopeLabel, title };
}

function specCandidateProducts(prefilteredProducts) {
  const valid = (items) => items.map((id) => products.find((product) => product.id === id)).filter(Boolean);
  if (state.compare.length) {
    return valid(state.compare);
  }
  if (state.shortlist.length) {
    return valid(state.shortlist);
  }
  const fallback = Array.isArray(prefilteredProducts) ? prefilteredProducts : products.filter(matchesFilters);
  return fallback.slice(0, 12);
}

function specScopeLabel() {
  if (state.compare.length) {
    return "Using compare list";
  }
  if (state.shortlist.length) {
    return "Using shortlist";
  }
  return "Using current Finder results";
}

function scoreSpecProduct(product, requirements) {
  const specTokens = requirementTokens(requirements.mustHave);
  const appTokens = requirementTokens(requirements.application);
  const certTokens = requirementTokens(requirements.certifications);
  const productText = productSearchText(product);
  const specHits = specTokens.filter((token) => productText.includes(normalizeToken(token)));
  const appHits = appTokens.filter((token) => productText.includes(normalizeToken(token)));
  const certHits = certTokens.filter((token) => product.certifications.some((cert) => normalizeToken(cert).includes(normalizeToken(token))));
  const sourceOk = sourceRequirementMet(product, requirements.sourceRequirement);
  const confidence = confidenceForProduct(product);
  const gaps = [];
  const strengths = [];

  const specRatio = specTokens.length ? specHits.length / specTokens.length : 1;
  const appRatio = appTokens.length ? appHits.length / appTokens.length : 1;
  const certRatio = certTokens.length ? certHits.length / certTokens.length : 1;

  if (specTokens.length) {
    strengths.push(`${specHits.length}/${specTokens.length} must-have spec signals matched`);
    specTokens.filter((token) => !specHits.includes(token)).slice(0, 6).forEach((token) => gaps.push(`Spec not visible: ${token}`));
  } else {
    strengths.push("No must-have spec list entered yet");
  }

  if (appTokens.length) {
    strengths.push(`${appHits.length}/${appTokens.length} application signals matched`);
    appTokens.filter((token) => !appHits.includes(token)).slice(0, 4).forEach((token) => gaps.push(`Application not visible: ${token}`));
  }

  if (certTokens.length) {
    strengths.push(`${certHits.length}/${certTokens.length} certification signals matched`);
    certTokens.filter((token) => !certHits.includes(token)).slice(0, 4).forEach((token) => gaps.push(`Certification to confirm: ${token}`));
  }

  if (product.datasheet) {
    strengths.push("Datasheet signal available");
  } else {
    gaps.push("Datasheet not confirmed");
  }

  if (product.verified) {
    strengths.push("Verified source signal present");
  } else {
    gaps.push("Verified source signal missing");
  }

  if (sourceOk) {
    strengths.push(sourceRequirementLabel(requirements.sourceRequirement));
  } else {
    gaps.push(`Source requirement not met: ${sourceRequirementLabel(requirements.sourceRequirement)}`);
  }

  if (requirements.criticality === "Safety or process critical") {
    if (!product.datasheet) {
      gaps.push("Safety/process critical: latest datasheet must be requested");
    }
    if (!product.certifications.length) {
      gaps.push("Safety/process critical: certificates must be confirmed");
    }
    if (confidence.level === "review") {
      gaps.push("Safety/process critical: catalog confidence needs review");
    }
  }

  if (requirements.criticality === "Production critical" && confidence.level === "review") {
    gaps.push("Production critical: confidence should be strengthened before RFQ award");
  }

  if (requirements.criticality === "Obsolete replacement" && !product.alternatives.length) {
    gaps.push("Obsolete replacement: alternates should be reviewed");
  }

  let score = 30;
  score += specRatio * 28;
  score += appRatio * 14;
  score += certRatio * 12;
  score += sourceOk ? 10 : -8;
  score += product.datasheet ? 5 : -4;
  score += product.verified ? 5 : -3;
  score += Math.round(product[state.priority] * 0.08);
  score += confidence.level === "high" ? 5 : confidence.level === "review" ? -8 : 0;
  if (requirements.criticality === "Safety or process critical") {
    score -= gaps.filter((gap) => /critical|certificate|datasheet|confidence/i.test(gap)).length * 3;
  }
  score = Math.max(0, Math.min(100, Math.round(score)));

  const status = score >= 86 ? "Strong technical fit" : score >= 72 ? "Plausible fit" : score >= 56 ? "Engineering review" : "Weak fit";
  const statusClass = score >= 86 ? "strong" : score >= 72 ? "plausible" : score >= 56 ? "review" : "weak";
  const nextAction = specNextAction({ product, requirements, gaps, score });

  return {
    product,
    score,
    status,
    statusClass,
    strengths: strengths.slice(0, 6),
    gaps: [...new Set(gaps)].slice(0, 8),
    matched: {
      specs: specHits,
      applications: appHits,
      certifications: certHits
    },
    nextAction
  };
}

function productSearchText(product) {
  return normalizeToken([
    product.brand,
    product.sku,
    product.name,
    product.category,
    product.family,
    product.description,
    product.lifecycle,
    ...product.specs,
    ...product.applications,
    ...product.certifications,
    ...product.alternatives,
    ...product.sources.map((source) => `${source.type} ${source.name} ${source.action} ${source.region}`)
  ].join(" "));
}

function requirementTokens(value) {
  return [...new Set(String(value || "")
    .split(/[\n,;|]+/)
    .map((token) => cleanText(token, 80).trim())
    .filter(Boolean))]
    .slice(0, 18);
}

function normalizeToken(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function sourceRequirementMet(product, requirement) {
  if (requirement === "datasheet") {
    return Boolean(product.datasheet);
  }
  if (requirement === "verified") {
    return Boolean(product.verified);
  }
  if (requirement === "oem-distributor") {
    return product.sources.some((source) => ["OEM", "Distributor", "MRO"].includes(source.type));
  }
  return product.sources.length > 0;
}

function sourceRequirementLabel(requirement) {
  const labels = {
    any: "Any useful source path present",
    "oem-distributor": "OEM or distributor path present",
    datasheet: "Datasheet required",
    verified: "Verified source signal required"
  };
  return labels[requirement] || labels.any;
}

function specRequirementsLabel(requirements) {
  const tokens = [
    requirements.application ? `Application: ${requirements.application}` : "",
    requirements.mustHave ? `Specs: ${requirements.mustHave}` : "",
    requirements.certifications ? `Certs: ${requirements.certifications}` : "",
    sourceRequirementLabel(requirements.sourceRequirement),
    requirements.criticality
  ].filter(Boolean);
  return tokens.join(" | ");
}

function specNextAction({ product, requirements, gaps, score }) {
  if (!requirements.mustHave && !requirements.application && !requirements.certifications) {
    return "Add buyer specs, application, or certification requirements for a more useful match matrix.";
  }
  if (score >= 86 && !gaps.length) {
    return "Use as a technical front-runner, then confirm exact suffix, datasheet revision, certificates, and installed-equipment compatibility.";
  }
  if (score >= 72) {
    return "Send RFQ with the open gaps as supplier confirmation questions before treating it as technically acceptable.";
  }
  if (score >= 56) {
    return "Request engineering or maintenance review before comparing commercial offers.";
  }
  return `Do not treat ${product.brand} ${product.sku} as a direct fit until missing specs and source evidence are confirmed.`;
}

function specStatTemplate(label, value, detail) {
  return `
    <article class="spec-stat">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
      <small>${escapeHtml(detail)}</small>
    </article>
  `;
}

function specMatchCardTemplate(card) {
  const product = card.product;
  const sourceNames = product.sources.slice(0, 3).map((source) => `${source.type}: ${source.name}`).join(", ");
  const certs = product.certifications.length ? product.certifications.join(", ") : "Check";
  return `
    <article class="spec-card ${escapeHtml(card.statusClass)}">
      <div class="spec-card-head">
        <div>
          <span>${escapeHtml(product.category)}</span>
          <h3>${escapeHtml(product.brand)} ${escapeHtml(product.sku)}</h3>
          <p>${escapeHtml(product.name)}</p>
        </div>
        <strong>${escapeHtml(card.status)}</strong>
      </div>
      <div class="spec-score">
        <div>
          <span>Requirement fit</span>
          <strong>${card.score}</strong>
        </div>
        <div class="bar" aria-hidden="true"><i style="width:${card.score}%"></i></div>
      </div>
      <dl class="spec-facts">
        <div><dt>Family</dt><dd>${escapeHtml(product.family)}</dd></div>
        <div><dt>Lead</dt><dd>${escapeHtml(product.lead)}</dd></div>
        <div><dt>MOQ</dt><dd>${escapeHtml(product.moq)}</dd></div>
        <div><dt>Certs</dt><dd>${escapeHtml(certs)}</dd></div>
        <div><dt>Datasheet</dt><dd>${product.datasheet ? "Yes" : "Check"}</dd></div>
        <div><dt>Sources</dt><dd>${escapeHtml(sourceNames)}</dd></div>
      </dl>
      <div class="spec-columns">
        <div>
          <span>Matched / strengths</span>
          <ul>${card.strengths.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        </div>
        <div>
          <span>Gaps to confirm</span>
          <ul>${card.gaps.length ? card.gaps.map((item) => `<li>${escapeHtml(item)}</li>`).join("") : "<li>No visible gaps from current requirement profile.</li>"}</ul>
        </div>
      </div>
      <p class="spec-next"><strong>Next action:</strong> ${escapeHtml(card.nextAction)}</p>
    </article>
  `;
}

function specMatrixText() {
  const matrix = specMatchData();
  const rows = matrix.cards.map((card, index) => `#${index + 1} ${card.product.brand} ${card.product.sku} - ${card.score}% (${card.status})
Product: ${card.product.name}
Category: ${card.product.category}
Matched specs: ${card.matched.specs.join(", ") || "None visible"}
Matched applications: ${card.matched.applications.join(", ") || "None visible"}
Matched certifications: ${card.matched.certifications.join(", ") || "None visible"}
Strengths:
${card.strengths.map((item) => `- ${item}`).join("\n")}
Gaps:
${card.gaps.length ? card.gaps.map((item) => `- ${item}`).join("\n") : "- No visible gaps from current requirement profile."}
Next action: ${card.nextAction}`).join("\n\n");

  return `InduScout spec match matrix
Prepared on ${formatCopyDate()}

Project: ${projectValue("name", "TBC")}
Buyer/company: ${projectValue("buyer", "TBC")}
Delivery country: ${projectValue("country", "TBC")}
Target date: ${projectValue("targetDate", "TBC")}

Requirement profile:
- Application: ${matrix.requirements.application || "TBC"}
- Must-have specs: ${matrix.requirements.mustHave || "TBC"}
- Required certifications: ${matrix.requirements.certifications || "TBC"}
- Source requirement: ${sourceRequirementLabel(matrix.requirements.sourceRequirement)}
- Criticality: ${matrix.requirements.criticality}
- Scope: ${matrix.scopeLabel}

Summary:
- Products scored: ${matrix.cards.length}
- Best fit: ${matrix.top ? `${matrix.top.product.brand} ${matrix.top.product.sku} (${matrix.top.score}%)` : "TBC"}
- Strong fits: ${matrix.strongFits}
- Open technical gaps: ${matrix.gapCount}

Technical fit matrix:
${rows || "No products available for spec matching."}

Buyer reminder:
Use this as a screening aid only. Confirm exact part number, suffix, dimensions, voltage, material, datasheet revision, certificate scope, installed-equipment compatibility, and supplier evidence before RFQ award or purchase.`;
}

function specMatrixSnapshot() {
  const matrix = specMatchData();
  return {
    ...createSessionSnapshot(),
    specMatch: {
      generatedAt: new Date().toISOString(),
      requirements: matrix.requirements,
      scopeLabel: matrix.scopeLabel,
      topProduct: matrix.top,
      strongFits: matrix.strongFits,
      gapCount: matrix.gapCount,
      products: matrix.cards,
      generatedText: specMatrixText()
    }
  };
}

async function copySpecMatrix() {
  updateProjectFromFields();
  const text = specMatrixText();
  try {
    await navigator.clipboard.writeText(text);
    if (els.copySpecMatrix) {
      els.copySpecMatrix.textContent = "Matrix copied";
      setTimeout(() => {
        els.copySpecMatrix.textContent = "Copy spec matrix";
      }, 1400);
    }
  } catch {
    window.prompt("Copy spec matrix", text);
  }
  renderSpecMatchDesk();
}

function downloadSpecMatrixHtml() {
  updateProjectFromFields();
  const projectSlug = safeFilenamePart(projectValue("name", ""));
  const date = new Date().toISOString().slice(0, 10);
  const filename = `InduScout-Spec-Match${projectSlug ? `-${projectSlug}` : ""}-${date}.html`;
  downloadFile(filename, specMatrixHtml(), "text/html;charset=utf-8");
  renderSpecMatchDesk();
}

function exportSpecMatrixJson() {
  updateProjectFromFields();
  const projectSlug = safeFilenamePart(projectValue("name", ""));
  const date = new Date().toISOString().slice(0, 10);
  const filename = projectSlug ? `InduScout-Spec-Match-${projectSlug}-${date}.json` : `InduScout-Spec-Match-${date}.json`;
  downloadFile(filename, JSON.stringify(specMatrixSnapshot(), null, 2), "application/json;charset=utf-8");
  renderSpecMatchDesk();
}

function specMatrixHtml() {
  const matrix = specMatchData();
  const text = specMatrixText();
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>InduScout Spec Match Matrix</title>
  <style>
    :root { color-scheme: light; }
    body { margin: 0; font-family: Arial, Helvetica, sans-serif; color: #0f172a; background: #eef6f8; }
    main { max-width: 980px; margin: 0 auto; padding: 32px; }
    header, section { background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; margin-bottom: 14px; padding: 20px; }
    h1 { margin: 6px 0 10px; font-size: 32px; line-height: 1.05; }
    p, pre { font-size: 13px; line-height: 1.55; }
    pre { white-space: pre-wrap; font-family: Arial, Helvetica, sans-serif; margin: 0; }
    .eyebrow { color: #00766f; font-size: 12px; font-weight: 800; text-transform: uppercase; }
    .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin: 14px 0; }
    .stat { border: 1px solid #dbe7ef; border-radius: 8px; padding: 12px; }
    .stat span { display: block; color: #64748b; font-size: 11px; font-weight: 800; text-transform: uppercase; }
    .stat strong { display: block; margin-top: 6px; font-size: 22px; }
    button { background: #0f172a; color: #ffffff; border: 0; border-radius: 6px; padding: 10px 14px; font-weight: 800; }
    @media print { body { background: #ffffff; } main { padding: 0; } button { display: none; } header, section { break-inside: avoid; } }
  </style>
</head>
<body>
  <main>
    <header>
      <div class="eyebrow">InduScout spec match matrix</div>
      <h1>${escapeHtml(matrix.title)}</h1>
      <p>Prepared on ${escapeHtml(formatCopyDate())}. Use this as a technical screening aid before RFQ or supplier award.</p>
      <button onclick="window.print()">Save as PDF</button>
    </header>
    <div class="stats">
      <div class="stat"><span>Products scored</span><strong>${escapeHtml(matrix.cards.length)}</strong></div>
      <div class="stat"><span>Best fit</span><strong>${escapeHtml(matrix.top ? `${matrix.top.score}%` : "TBC")}</strong></div>
      <div class="stat"><span>Strong fits</span><strong>${escapeHtml(matrix.strongFits)}</strong></div>
      <div class="stat"><span>Open gaps</span><strong>${escapeHtml(matrix.gapCount)}</strong></div>
    </div>
    <section>
      <pre>${escapeHtml(text)}</pre>
    </section>
  </main>
</body>
</html>`;
}

function alternateReviewInputs() {
  return [
    els.alternateProduct,
    els.alternateCriticality,
    els.alternateEquipment,
    els.alternateConstraint
  ].filter(Boolean);
}

function defaultAlternateReview() {
  return {
    productId: products[0]?.id || "",
    criticality: "Standard spare",
    equipment: "",
    constraint: ""
  };
}

function hydrateAlternateReviewFields() {
  if (!els.alternateForm) {
    return;
  }
  const review = { ...defaultAlternateReview(), ...state.alternateReview };
  const productId = products.some((product) => product.id === review.productId) ? review.productId : products[0]?.id || "";
  els.alternateProduct.value = productId;
  els.alternateCriticality.value = review.criticality;
  els.alternateEquipment.value = review.equipment;
  els.alternateConstraint.value = review.constraint;
  state.alternateReview = sanitizeAlternateReview({ ...review, productId });
}

function alternateReviewFromFields() {
  return sanitizeAlternateReview({
    productId: els.alternateProduct?.value || "",
    criticality: els.alternateCriticality?.value || "Standard spare",
    equipment: els.alternateEquipment?.value || "",
    constraint: els.alternateConstraint?.value || ""
  });
}

function updateAlternateReviewFromFields() {
  state.alternateReview = alternateReviewFromFields();
  saveAlternateReview();
  renderAlternateDesk();
}

function saveAlternateReviewFromFields() {
  updateAlternateReviewFromFields();
  if (els.saveAlternateDesk) {
    els.saveAlternateDesk.textContent = "Review setup saved";
    setTimeout(() => {
      els.saveAlternateDesk.textContent = "Save review setup";
    }, 1200);
  }
}

function resetAlternateReview() {
  state.alternateReview = defaultAlternateReview();
  saveAlternateReview();
  hydrateAlternateReviewFields();
  renderAlternateDesk();
}

function renderAlternateDesk(prefilteredProducts) {
  if (!els.alternateStats || !els.alternateSummary || !els.alternateGrid) {
    return;
  }

  const review = alternateReviewData(prefilteredProducts);
  els.alternateSummary.textContent = review.title;
  els.alternateStats.innerHTML = [
    alternateStatTemplate("Base product", review.base ? `${review.base.brand} ${review.base.sku}` : "TBC", review.base ? review.base.lifecycle : "Select a product"),
    alternateStatTemplate("Known alternates", review.cards.length, review.cards.length ? "Catalog candidates found" : "No catalog matches"),
    alternateStatTemplate("Best candidate", review.best ? `${review.best.product.brand} ${review.best.product.sku}` : "TBC", review.best ? `${review.best.score}% engineering fit` : "Needs research"),
    alternateStatTemplate("Review gaps", review.gapCount, review.gapCount ? "Checks before substitution" : "No visible gaps")
  ].join("");

  if (!review.base) {
    els.alternateGrid.innerHTML = '<div class="empty-state alternate-empty">Select a base product to review alternate and obsolescence risk.</div>';
    return;
  }

  els.alternateGrid.innerHTML = [
    alternateBaseTemplate(review),
    ...review.cards.map(alternateCardTemplate)
  ].join("");
}

function alternateReviewData(prefilteredProducts) {
  const setup = state.alternateReview || defaultAlternateReview();
  const base = products.find((product) => product.id === setup.productId) || products[0] || null;
  const candidates = base ? alternateCandidateProducts(base, prefilteredProducts) : [];
  const cards = candidates
    .map((product) => scoreAlternateCandidate(base, product, setup))
    .sort((a, b) => b.score - a.score || b.product[state.priority] - a.product[state.priority])
    .slice(0, 8);
  const best = cards[0] || null;
  const gapCount = cards.reduce((total, card) => total + card.gaps.length, 0);
  const title = base
    ? `${base.brand} ${base.sku} alternate review`
    : "Alternate review needs a base product";
  return { setup, base, candidates, cards, best, gapCount, title };
}

function alternateCandidateProducts(base, prefilteredProducts) {
  const byId = new Map();
  const add = (product) => {
    if (product && product.id !== base.id) {
      byId.set(product.id, product);
    }
  };
  base.alternatives.forEach((name) => findProductByAlternateName(name, base.category).forEach(add));
  products.filter((product) => product.category === base.category && product.id !== base.id).forEach(add);
  (state.compare.length ? state.compare : state.shortlist).forEach((id) => add(products.find((product) => product.id === id)));
  if (!byId.size && Array.isArray(prefilteredProducts)) {
    prefilteredProducts.filter((product) => product.category === base.category).forEach(add);
  }
  return [...byId.values()];
}

function findProductByAlternateName(name, category) {
  const token = normalizeToken(name);
  if (!token) {
    return [];
  }
  return products.filter((product) => {
    if (category && product.category !== category) {
      return false;
    }
    const haystack = normalizeToken(`${product.brand} ${product.sku} ${product.name} ${product.family}`);
    return haystack.includes(token) || token.includes(normalizeToken(product.sku)) || token.includes(normalizeToken(product.brand));
  });
}

function scoreAlternateCandidate(base, product, setup) {
  const baseText = productSearchText(base);
  const productText = productSearchText(product);
  const baseSpecTokens = [...base.specs, ...base.applications, base.family, base.category].map(normalizeToken).filter(Boolean);
  const matches = baseSpecTokens.filter((token) => productText.includes(token)).slice(0, 8);
  const gaps = [];
  const strengths = [];
  const sourceOk = product.sources.some((source) => ["OEM", "Distributor", "MRO"].includes(source.type));
  const confidence = confidenceForProduct(product);
  const certOverlap = product.certifications.filter((cert) => base.certifications.map(normalizeToken).includes(normalizeToken(cert)));

  if (product.category === base.category) {
    strengths.push("Same procurement category");
  } else {
    gaps.push(`Different category: ${product.category}`);
  }

  if (product.family === base.family) {
    strengths.push("Same product family");
  } else {
    gaps.push("Different family or series; dimensional and functional fit must be checked");
  }

  if (matches.length) {
    strengths.push(`${matches.length} overlapping spec/application signals`);
  } else {
    gaps.push("No visible spec overlap in current catalog record");
  }

  if (certOverlap.length) {
    strengths.push(`Shared certifications: ${certOverlap.join(", ")}`);
  } else if (base.certifications.length) {
    gaps.push(`Confirm required certifications: ${base.certifications.join(", ")}`);
  }

  if (product.datasheet) {
    strengths.push("Candidate datasheet signal available");
  } else {
    gaps.push("Candidate datasheet not confirmed");
  }

  if (sourceOk) {
    strengths.push("Candidate has OEM, distributor, or MRO source path");
  } else {
    gaps.push("Candidate lacks primary source path");
  }

  if (setup.constraint) {
    const constraintTokens = requirementTokens(setup.constraint);
    const constraintHits = constraintTokens.filter((token) => productText.includes(normalizeToken(token)));
    if (constraintHits.length) {
      strengths.push(`${constraintHits.length}/${constraintTokens.length} known constraints visible`);
    }
    constraintTokens.filter((token) => !constraintHits.includes(token)).slice(0, 4).forEach((token) => gaps.push(`Constraint to confirm: ${token}`));
  }

  if (/obsolete|no-stock/i.test(setup.criticality) && !product.alternatives.length) {
    gaps.push("Obsolete/no-stock review: ask supplier for substitute justification and current lifecycle");
  }

  if (setup.criticality === "Safety or process critical") {
    gaps.push("Safety/process critical: buyer should require engineering sign-off before substitution");
    if (!product.datasheet || !product.certifications.length) {
      gaps.push("Safety/process critical: datasheet and certificate evidence are mandatory");
    }
  }

  let score = 25;
  score += product.category === base.category ? 18 : -10;
  score += product.family === base.family ? 18 : 0;
  score += Math.min(matches.length, 6) * 5;
  score += Math.min(certOverlap.length, 3) * 4;
  score += product.datasheet ? 7 : -5;
  score += sourceOk ? 8 : -6;
  score += confidence.level === "high" ? 8 : confidence.level === "review" ? -8 : 3;
  score += Math.round(product[state.priority] * 0.05);
  if (setup.criticality === "Safety or process critical") {
    score -= 10;
  }
  if (/obsolete|no-stock/i.test(setup.criticality)) {
    score -= 4;
  }
  score = Math.max(0, Math.min(100, Math.round(score)));

  const status = score >= 82 ? "Strong candidate" : score >= 68 ? "Review candidate" : score >= 52 ? "High review effort" : "Weak substitute";
  const statusClass = score >= 82 ? "strong" : score >= 68 ? "plausible" : score >= 52 ? "review" : "weak";
  const nextAction = alternateNextAction({ base, product, setup, score, gaps });

  return {
    product,
    score,
    status,
    statusClass,
    strengths: [...new Set(strengths)].slice(0, 7),
    gaps: [...new Set(gaps)].slice(0, 9),
    nextAction
  };
}

function alternateNextAction({ base, product, setup, score, gaps }) {
  if (setup.criticality === "Safety or process critical") {
    return `Require engineering sign-off, latest datasheet, certificate scope, and supplier written confirmation before replacing ${base.brand} ${base.sku} with ${product.brand} ${product.sku}.`;
  }
  if (score >= 82 && gaps.length <= 2) {
    return "Treat as a front-runner alternate, but confirm exact suffix, dimensions, electrical/mechanical interface, certificate scope, and warranty path.";
  }
  if (score >= 68) {
    return "Send the open gaps as supplier questions and ask maintenance or engineering to approve before commercial award.";
  }
  return "Keep as research-only until missing fit, source, lifecycle, and certification evidence is closed.";
}

function alternateRiskLevel(product, setup) {
  const confidence = confidenceForProduct(product);
  if (setup.criticality === "Safety or process critical") {
    return "Engineering sign-off required";
  }
  if (/obsolete|no-stock/i.test(setup.criticality)) {
    return "Obsolescence review";
  }
  if (confidence.level === "review" || !product.datasheet || !product.verified) {
    return "Buyer review required";
  }
  return "Standard verification";
}

function alternateStatTemplate(label, value, detail) {
  return `
    <article class="alternate-stat">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
      <small>${escapeHtml(detail)}</small>
    </article>
  `;
}

function alternateBaseTemplate(review) {
  const base = review.base;
  const setup = review.setup;
  return `
    <article class="alternate-base-card">
      <div>
        <span>Base product</span>
        <h3>${escapeHtml(base.brand)} ${escapeHtml(base.sku)}</h3>
        <p>${escapeHtml(base.name)}</p>
      </div>
      <dl>
        <div><dt>Category</dt><dd>${escapeHtml(base.category)}</dd></div>
        <div><dt>Family</dt><dd>${escapeHtml(base.family)}</dd></div>
        <div><dt>Lifecycle</dt><dd>${escapeHtml(base.lifecycle)}</dd></div>
        <div><dt>Criticality</dt><dd>${escapeHtml(setup.criticality)}</dd></div>
        <div><dt>Equipment</dt><dd>${escapeHtml(setup.equipment || "TBC")}</dd></div>
        <div><dt>Known constraint</dt><dd>${escapeHtml(setup.constraint || "TBC")}</dd></div>
      </dl>
      <p>Buyer reminder: alternates are technical review candidates only. Confirm exact model, suffix, dimensions, voltage, protocol, material, certificate scope, firmware/revision, warranty route, and installed-equipment compatibility before substitution.</p>
    </article>
  `;
}

function alternateCardTemplate(card) {
  const product = card.product;
  return `
    <article class="alternate-card ${escapeHtml(card.statusClass)}">
      <div class="alternate-card-head">
        <div>
          <span>${escapeHtml(product.category)}</span>
          <h3>${escapeHtml(product.brand)} ${escapeHtml(product.sku)}</h3>
          <p>${escapeHtml(product.name)}</p>
        </div>
        <strong>${escapeHtml(card.status)}</strong>
      </div>
      <div class="alternate-score">
        <div>
          <span>Engineering fit</span>
          <strong>${card.score}</strong>
        </div>
        <div class="bar" aria-hidden="true"><i style="width:${card.score}%"></i></div>
      </div>
      <dl class="alternate-facts">
        <div><dt>Family</dt><dd>${escapeHtml(product.family)}</dd></div>
        <div><dt>Lifecycle</dt><dd>${escapeHtml(product.lifecycle)}</dd></div>
        <div><dt>Lead</dt><dd>${escapeHtml(product.lead)}</dd></div>
        <div><dt>Datasheet</dt><dd>${product.datasheet ? "Yes" : "Check"}</dd></div>
        <div><dt>Risk</dt><dd>${escapeHtml(alternateRiskLevel(product, state.alternateReview))}</dd></div>
      </dl>
      <div class="alternate-columns">
        <div>
          <span>Positive signals</span>
          <ul>${card.strengths.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        </div>
        <div>
          <span>Checks before substitution</span>
          <ul>${card.gaps.length ? card.gaps.map((item) => `<li>${escapeHtml(item)}</li>`).join("") : "<li>No visible gaps from current catalog data.</li>"}</ul>
        </div>
      </div>
      <p class="alternate-next"><strong>Next action:</strong> ${escapeHtml(card.nextAction)}</p>
    </article>
  `;
}

function alternateReviewText() {
  const review = alternateReviewData();
  const base = review.base;
  const rows = review.cards.map((card, index) => `#${index + 1} ${card.product.brand} ${card.product.sku} - ${card.score}% (${card.status})
Product: ${card.product.name}
Lifecycle: ${card.product.lifecycle}
Positive signals:
${card.strengths.map((item) => `- ${item}`).join("\n")}
Checks before substitution:
${card.gaps.length ? card.gaps.map((item) => `- ${item}`).join("\n") : "- No visible gaps from current catalog data."}
Next action: ${card.nextAction}`).join("\n\n");

  return `InduScout alternate and obsolescence review
Prepared on ${formatCopyDate()}

Project: ${projectValue("name", "TBC")}
Buyer/company: ${projectValue("buyer", "TBC")}
Installed equipment/location: ${review.setup.equipment || "TBC"}
Known constraint: ${review.setup.constraint || "TBC"}
Replacement criticality: ${review.setup.criticality}

Base product:
${base ? `${base.brand} ${base.sku} - ${base.name}` : "TBC"}
Category: ${base ? base.category : "TBC"}
Family: ${base ? base.family : "TBC"}
Lifecycle: ${base ? base.lifecycle : "TBC"}

Review summary:
- Known alternates scored: ${review.cards.length}
- Best candidate: ${review.best ? `${review.best.product.brand} ${review.best.product.sku} (${review.best.score}%)` : "TBC"}
- Open checks: ${review.gapCount}

Candidate alternates:
${rows || "No catalog alternate candidates found. Create a product request or source lead for further research."}

Engineering review checklist:
- Confirm exact model, suffix, voltage, dimensions, material, protocol, mounting, connection, firmware/revision, and environmental rating.
- Confirm latest datasheet, certificate scope, country of origin, warranty route, and lifecycle status.
- Confirm installed-equipment compatibility with maintenance, engineering, or OEM before approving a substitute.
- Treat alternates as review candidates only, not automatic replacements.

InduScout is a discovery and RFQ preparation aid. Final substitute approval remains with the buyer, engineering team, OEM, and supplier evidence.`;
}

function alternateReviewSnapshot() {
  const review = alternateReviewData();
  return {
    ...createSessionSnapshot(),
    alternateReviewDesk: {
      generatedAt: new Date().toISOString(),
      setup: review.setup,
      baseProduct: review.base,
      bestCandidate: review.best,
      gapCount: review.gapCount,
      candidates: review.cards,
      generatedText: alternateReviewText()
    }
  };
}

async function copyAlternateReview() {
  updateProjectFromFields();
  const text = alternateReviewText();
  try {
    await navigator.clipboard.writeText(text);
    if (els.copyAlternateReview) {
      els.copyAlternateReview.textContent = "Review note copied";
      setTimeout(() => {
        els.copyAlternateReview.textContent = "Copy review note";
      }, 1400);
    }
  } catch {
    window.prompt("Copy alternate review note", text);
  }
  renderAlternateDesk();
}

function downloadAlternateReviewHtml() {
  updateProjectFromFields();
  const review = alternateReviewData();
  const projectSlug = safeFilenamePart(projectValue("name", ""));
  const productSlug = safeFilenamePart(review.base ? `${review.base.brand}-${review.base.sku}` : "alternate-review");
  const date = new Date().toISOString().slice(0, 10);
  const filename = `InduScout-Alternate-Review-${productSlug}${projectSlug ? `-${projectSlug}` : ""}-${date}.html`;
  downloadFile(filename, alternateReviewHtml(), "text/html;charset=utf-8");
  renderAlternateDesk();
}

function exportAlternateReviewJson() {
  updateProjectFromFields();
  const review = alternateReviewData();
  const productSlug = safeFilenamePart(review.base ? `${review.base.brand}-${review.base.sku}` : "alternate-review");
  const date = new Date().toISOString().slice(0, 10);
  downloadFile(`InduScout-Alternate-Review-${productSlug}-${date}.json`, JSON.stringify(alternateReviewSnapshot(), null, 2), "application/json;charset=utf-8");
  renderAlternateDesk();
}

function alternateReviewHtml() {
  const review = alternateReviewData();
  const text = alternateReviewText();
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>InduScout Alternate Review</title>
  <style>
    :root { color-scheme: light; }
    body { margin: 0; font-family: Arial, Helvetica, sans-serif; color: #0f172a; background: #eef6f8; }
    main { max-width: 980px; margin: 0 auto; padding: 32px; }
    header, section { background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; margin-bottom: 14px; padding: 20px; }
    h1 { margin: 6px 0 10px; font-size: 32px; line-height: 1.05; }
    p, pre { font-size: 13px; line-height: 1.55; }
    pre { white-space: pre-wrap; font-family: Arial, Helvetica, sans-serif; margin: 0; }
    .eyebrow { color: #00766f; font-size: 12px; font-weight: 800; text-transform: uppercase; }
    .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin: 14px 0; }
    .stat { border: 1px solid #dbe7ef; border-radius: 8px; padding: 12px; }
    .stat span { display: block; color: #64748b; font-size: 11px; font-weight: 800; text-transform: uppercase; }
    .stat strong { display: block; margin-top: 6px; font-size: 22px; }
    button { background: #0f172a; color: #ffffff; border: 0; border-radius: 6px; padding: 10px 14px; font-weight: 800; }
    @media print { body { background: #ffffff; } main { padding: 0; } button { display: none; } header, section { break-inside: avoid; } }
  </style>
</head>
<body>
  <main>
    <header>
      <div class="eyebrow">InduScout alternate review</div>
      <h1>${escapeHtml(review.title)}</h1>
      <p>Prepared on ${escapeHtml(formatCopyDate())}. Use this as a conservative replacement review aid before substitution approval.</p>
      <button onclick="window.print()">Save as PDF</button>
    </header>
    <div class="stats">
      <div class="stat"><span>Base product</span><strong>${escapeHtml(review.base ? `${review.base.brand} ${review.base.sku}` : "TBC")}</strong></div>
      <div class="stat"><span>Candidates</span><strong>${escapeHtml(review.cards.length)}</strong></div>
      <div class="stat"><span>Best fit</span><strong>${escapeHtml(review.best ? `${review.best.score}%` : "TBC")}</strong></div>
      <div class="stat"><span>Open checks</span><strong>${escapeHtml(review.gapCount)}</strong></div>
    </div>
    <section>
      <pre>${escapeHtml(text)}</pre>
    </section>
  </main>
</body>
</html>`;
}

function substitutionApprovalInputs() {
  return [
    els.approvalBase,
    els.approvalCandidate,
    els.approvalDecision,
    els.approvalReviewer,
    els.approvalEquipment,
    els.approvalNotes,
    els.approvalCheckModel,
    els.approvalCheckDatasheet,
    els.approvalCheckInterface,
    els.approvalCheckSafety,
    els.approvalCheckSupplier
  ].filter(Boolean);
}

function defaultSubstitutionApproval() {
  const baseProductId = products[0]?.id || "";
  const candidateProductId = products.find((product) => product.id !== baseProductId)?.id || baseProductId;
  return {
    baseProductId,
    candidateProductId,
    decision: "Engineering review required",
    reviewer: "",
    equipment: "",
    notes: "",
    checks: {
      model: false,
      datasheet: false,
      interface: false,
      safety: false,
      supplier: false
    }
  };
}

function hydrateSubstitutionApprovalFields() {
  if (!els.approvalForm) {
    return;
  }
  const approval = sanitizeSubstitutionApproval(state.substitutionApproval || {});
  els.approvalBase.value = approval.baseProductId;
  els.approvalCandidate.value = approval.candidateProductId || suggestedApprovalCandidateId(approval.baseProductId);
  els.approvalDecision.value = approval.decision;
  els.approvalReviewer.value = approval.reviewer;
  els.approvalEquipment.value = approval.equipment;
  els.approvalNotes.value = approval.notes;
  els.approvalCheckModel.checked = approval.checks.model;
  els.approvalCheckDatasheet.checked = approval.checks.datasheet;
  els.approvalCheckInterface.checked = approval.checks.interface;
  els.approvalCheckSafety.checked = approval.checks.safety;
  els.approvalCheckSupplier.checked = approval.checks.supplier;
  state.substitutionApproval = substitutionApprovalFromFields();
}

function substitutionApprovalFromFields() {
  return sanitizeSubstitutionApproval({
    baseProductId: els.approvalBase?.value || "",
    candidateProductId: els.approvalCandidate?.value || "",
    decision: els.approvalDecision?.value || "Engineering review required",
    reviewer: els.approvalReviewer?.value || "",
    equipment: els.approvalEquipment?.value || "",
    notes: els.approvalNotes?.value || "",
    checks: {
      model: Boolean(els.approvalCheckModel?.checked),
      datasheet: Boolean(els.approvalCheckDatasheet?.checked),
      interface: Boolean(els.approvalCheckInterface?.checked),
      safety: Boolean(els.approvalCheckSafety?.checked),
      supplier: Boolean(els.approvalCheckSupplier?.checked)
    }
  });
}

function updateSubstitutionApprovalFromFields() {
  state.substitutionApproval = substitutionApprovalFromFields();
  saveSubstitutionApproval();
  renderSubstitutionApprovalPack();
}

function saveSubstitutionApprovalFromFields() {
  updateSubstitutionApprovalFromFields();
  if (els.saveApprovalPack) {
    els.saveApprovalPack.textContent = "Approval pack saved";
    setTimeout(() => {
      els.saveApprovalPack.textContent = "Save approval pack";
    }, 1200);
  }
}

function resetSubstitutionApproval() {
  state.substitutionApproval = defaultSubstitutionApproval();
  saveSubstitutionApproval();
  hydrateSubstitutionApprovalFields();
  renderSubstitutionApprovalPack();
}

function syncApprovalCandidateToBase() {
  if (!els.approvalBase || !els.approvalCandidate) {
    return;
  }
  const nextCandidate = suggestedApprovalCandidateId(els.approvalBase.value);
  if (nextCandidate) {
    els.approvalCandidate.value = nextCandidate;
  }
  updateSubstitutionApprovalFromFields();
}

function suggestedApprovalCandidateId(baseProductId) {
  const base = products.find((product) => product.id === baseProductId) || products[0];
  if (!base) {
    return "";
  }
  const reviewCards = alternateCandidateProducts(base).map((product) => scoreAlternateCandidate(base, product, state.alternateReview || defaultAlternateReview()));
  const best = reviewCards.sort((a, b) => b.score - a.score)[0]?.product;
  return best?.id || products.find((product) => product.id !== base.id && product.category === base.category)?.id || products.find((product) => product.id !== base.id)?.id || base.id;
}

function renderSubstitutionApprovalPack() {
  if (!els.approvalStats || !els.approvalSummary || !els.approvalPreview) {
    return;
  }

  const approval = substitutionApprovalData();
  els.approvalSummary.textContent = approval.title;
  els.approvalStats.innerHTML = [
    approvalStatTemplate("Decision", approval.setup.decision, approval.statusLabel),
    approvalStatTemplate("Approval score", approval.score, `${approval.completedChecks}/5 checks complete`),
    approvalStatTemplate("Risk", approval.riskLabel, approval.openConditions.length ? `${approval.openConditions.length} open conditions` : "No visible open conditions"),
    approvalStatTemplate("Reviewer", approval.setup.reviewer || "TBC", approval.setup.equipment || "Equipment TBC")
  ].join("");

  if (!approval.base || !approval.candidate) {
    els.approvalPreview.innerHTML = '<div class="empty-state approval-empty">Select an original product and proposed substitute to build the approval pack.</div>';
    return;
  }

  els.approvalPreview.innerHTML = `
    <article class="approval-card ${escapeHtml(approval.statusClass)}">
      <span>Substitution record</span>
      <h3>${escapeHtml(approval.base.brand)} ${escapeHtml(approval.base.sku)} to ${escapeHtml(approval.candidate.brand)} ${escapeHtml(approval.candidate.sku)}</h3>
      <p>${escapeHtml(approval.recommendation)}</p>
      <div class="approval-pair">
        <div>
          <span>Original</span>
          <strong>${escapeHtml(approval.base.name)}</strong>
          <small>${escapeHtml(approval.base.family)} | ${escapeHtml(approval.base.lifecycle)}</small>
        </div>
        <div>
          <span>Substitute</span>
          <strong>${escapeHtml(approval.candidate.name)}</strong>
          <small>${escapeHtml(approval.candidate.family)} | ${escapeHtml(approval.candidate.lifecycle)}</small>
        </div>
      </div>
      <div class="approval-check-rows">
        ${approval.checkRows.map(approvalCheckRowTemplate).join("")}
      </div>
    </article>
    <article class="approval-warning">
      <span>Open approval conditions</span>
      <h3>${escapeHtml(approval.statusLabel)}</h3>
      <p>${escapeHtml(approval.setup.notes || "No buyer conditions entered yet.")}</p>
      <ul>${approval.openConditions.length ? approval.openConditions.map((item) => `<li>${escapeHtml(item)}</li>`).join("") : "<li>All minimum approval checks are marked complete. Keep supplier evidence attached to the buyer file.</li>"}</ul>
    </article>
  `;
}

function substitutionApprovalData() {
  const setup = state.substitutionApproval || defaultSubstitutionApproval();
  const base = products.find((product) => product.id === setup.baseProductId) || products[0] || null;
  const candidate = products.find((product) => product.id === setup.candidateProductId) || null;
  const checkRows = substitutionApprovalCheckRows(setup, base, candidate);
  const completedChecks = checkRows.filter((row) => row.done).length;
  const openConditions = substitutionApprovalOpenConditions(setup, base, candidate, checkRows);
  const score = substitutionApprovalScore(setup, base, candidate, completedChecks);
  const blocked = setup.decision === "Rejected substitute" || !base || !candidate || base.id === candidate.id;
  const approved = setup.decision === "Approved substitute" && score >= 82 && completedChecks === 5 && !openConditions.length;
  const statusClass = blocked ? "blocked" : approved ? "approved" : "review";
  const statusLabel = blocked ? "Blocked or invalid" : approved ? "Approval ready" : "Engineering review open";
  const riskLabel = substitutionApprovalRiskLabel(setup, base, candidate, completedChecks, openConditions);
  const recommendation = substitutionApprovalRecommendation(setup, base, candidate, score, completedChecks, openConditions);
  const title = base && candidate
    ? `${base.brand} ${base.sku} substitute approval`
    : "Substitution approval needs products";

  return { setup, base, candidate, checkRows, completedChecks, openConditions, score, statusClass, statusLabel, riskLabel, recommendation, title };
}

function substitutionApprovalCheckRows(setup, base, candidate) {
  return [
    { key: "model", done: setup.checks.model, label: "Exact model, suffix, voltage, size, material, and configuration checked" },
    { key: "datasheet", done: setup.checks.datasheet && Boolean(candidate?.datasheet), label: "Latest datasheet, certificate scope, and lifecycle evidence requested" },
    { key: "interface", done: setup.checks.interface, label: "Mechanical, electrical, software, protocol, and mounting interface reviewed" },
    { key: "safety", done: setup.checks.safety, label: "Safety, process, warranty, and installed-equipment compatibility reviewed" },
    { key: "supplier", done: setup.checks.supplier && Boolean(candidate?.sources?.length), label: "OEM/distributor/source path, stock, lead time, and commercial terms confirmed" }
  ];
}

function substitutionApprovalScore(setup, base, candidate, completedChecks) {
  if (!base || !candidate || base.id === candidate.id) {
    return 0;
  }
  const sourceOk = candidate.sources.some((source) => ["OEM", "Distributor", "MRO"].includes(source.type));
  const certOverlap = candidate.certifications.filter((cert) => base.certifications.map(normalizeToken).includes(normalizeToken(cert)));
  const productText = productSearchText(candidate);
  const overlap = [...base.specs, ...base.applications, base.family].map(normalizeToken).filter((token) => token && productText.includes(token)).length;
  let score = 20;
  score += base.category === candidate.category ? 14 : -12;
  score += base.family === candidate.family ? 10 : 0;
  score += Math.min(overlap, 6) * 4;
  score += Math.min(certOverlap.length, 3) * 4;
  score += candidate.datasheet ? 8 : -6;
  score += sourceOk ? 8 : -6;
  score += completedChecks * 8;
  if (setup.decision === "Approved substitute") {
    score += 6;
  }
  if (setup.decision === "Rejected substitute") {
    score -= 35;
  }
  if (setup.decision === "Trial order only") {
    score -= 4;
  }
  return Math.max(0, Math.min(100, Math.round(score)));
}

function substitutionApprovalOpenConditions(setup, base, candidate, checkRows) {
  const conditions = [];
  if (!base || !candidate) {
    return ["Select both original and substitute product records."];
  }
  if (base.id === candidate.id) {
    conditions.push("Original product and proposed substitute cannot be the same record.");
  }
  checkRows.filter((row) => !row.done).forEach((row) => conditions.push(row.label));
  if (base.category !== candidate.category) {
    conditions.push(`Category differs: ${base.category} vs ${candidate.category}.`);
  }
  if (base.family !== candidate.family) {
    conditions.push("Family or series differs; require dimensional and functional review.");
  }
  if (!candidate.datasheet) {
    conditions.push("Candidate datasheet signal is not available in the catalog record.");
  }
  if (!candidate.sources.some((source) => ["OEM", "Distributor", "MRO"].includes(source.type))) {
    conditions.push("Candidate needs an OEM, distributor, or MRO source path.");
  }
  if (!setup.reviewer) {
    conditions.push("Reviewer or responsible department is not recorded.");
  }
  if (!setup.equipment) {
    conditions.push("Installed equipment or location is not recorded.");
  }
  if (setup.decision === "Approved substitute" && conditions.length) {
    conditions.push("Approved substitute decision should wait until open conditions are closed.");
  }
  return [...new Set(conditions)].slice(0, 10);
}

function substitutionApprovalRiskLabel(setup, base, candidate, completedChecks, openConditions) {
  if (setup.decision === "Rejected substitute" || !base || !candidate || base.id === candidate.id) {
    return "Do not use";
  }
  if (setup.decision === "Approved substitute" && completedChecks === 5 && !openConditions.length) {
    return "Controlled approval";
  }
  if (setup.decision === "Trial order only") {
    return "Trial required";
  }
  if (completedChecks < 3 || openConditions.length > 5) {
    return "High review";
  }
  return "Conditional";
}

function substitutionApprovalRecommendation(setup, base, candidate, score, completedChecks, openConditions) {
  if (!base || !candidate) {
    return "Select product records before preparing a substitution approval.";
  }
  if (base.id === candidate.id) {
    return "Choose a different proposed substitute before approval.";
  }
  if (setup.decision === "Rejected substitute") {
    return "Keep the substitute rejected and record the reason in buyer notes or supplier evidence.";
  }
  if (setup.decision === "Approved substitute" && score >= 82 && completedChecks === 5 && !openConditions.length) {
    return "Approval pack is ready for buyer file attachment, subject to final supplier evidence and internal authorization.";
  }
  if (setup.decision === "Trial order only") {
    return "Use a limited trial or maintenance review before releasing the substitute for regular purchasing.";
  }
  return "Keep the substitute in engineering review until all open checks, source evidence, compatibility items, and reviewer ownership are closed.";
}

function approvalStatTemplate(label, value, detail) {
  return `
    <article class="approval-stat">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
      <small>${escapeHtml(detail)}</small>
    </article>
  `;
}

function approvalCheckRowTemplate(row) {
  return `
    <div class="approval-check-row ${row.done ? "complete" : ""}">
      <i>${row.done ? "OK" : "!"}</i>
      <strong>${escapeHtml(row.label)}</strong>
    </div>
  `;
}

function substitutionApprovalText() {
  const approval = substitutionApprovalData();
  const base = approval.base;
  const candidate = approval.candidate;
  const checkLines = approval.checkRows.map((row) => `- ${row.done ? "Complete" : "Open"}: ${row.label}`).join("\n");
  const conditionLines = approval.openConditions.length
    ? approval.openConditions.map((item) => `- ${item}`).join("\n")
    : "- No visible open conditions from the approval form.";

  return `InduScout substitution approval pack
Prepared on ${formatCopyDate()}

Project: ${projectValue("name", "TBC")}
Buyer/company: ${projectValue("buyer", "TBC")}
Reviewer/department: ${approval.setup.reviewer || "TBC"}
Equipment/location: ${approval.setup.equipment || "TBC"}
Decision status: ${approval.setup.decision}
Approval score: ${approval.score}
Risk label: ${approval.riskLabel}

Original product:
${base ? `${base.brand} ${base.sku} - ${base.name}` : "TBC"}
Category: ${base ? base.category : "TBC"}
Family: ${base ? base.family : "TBC"}
Lifecycle: ${base ? base.lifecycle : "TBC"}

Proposed substitute:
${candidate ? `${candidate.brand} ${candidate.sku} - ${candidate.name}` : "TBC"}
Category: ${candidate ? candidate.category : "TBC"}
Family: ${candidate ? candidate.family : "TBC"}
Lifecycle: ${candidate ? candidate.lifecycle : "TBC"}

Recommendation:
${approval.recommendation}

Minimum substitution checks:
${checkLines}

Open conditions:
${conditionLines}

Buyer notes or approval conditions:
${approval.setup.notes || "None recorded."}

Final verification checklist:
- Attach latest datasheet, certificate scope, lifecycle evidence, and source confirmation.
- Confirm exact suffix, voltage, dimensions, material, protocol, firmware/revision, mounting, and connection.
- Confirm installed-equipment compatibility with engineering, maintenance, OEM, or responsible reviewer.
- Confirm warranty route, stock, lead time, price, payment terms, delivery terms, and supplier legitimacy.
- Do not treat alternates as automatic substitutes without buyer and engineering approval.

InduScout is a discovery and RFQ preparation aid. Final substitute approval remains with the buyer, engineering team, OEM, and supplier evidence.`;
}

function substitutionApprovalSnapshot() {
  const approval = substitutionApprovalData();
  return {
    ...createSessionSnapshot(),
    substitutionApprovalPack: {
      generatedAt: new Date().toISOString(),
      setup: approval.setup,
      baseProduct: approval.base,
      candidateProduct: approval.candidate,
      score: approval.score,
      riskLabel: approval.riskLabel,
      statusLabel: approval.statusLabel,
      openConditions: approval.openConditions,
      checks: approval.checkRows,
      generatedText: substitutionApprovalText()
    }
  };
}

async function copySubstitutionApprovalPack() {
  updateProjectFromFields();
  const text = substitutionApprovalText();
  try {
    await navigator.clipboard.writeText(text);
    if (els.copyApprovalPack) {
      els.copyApprovalPack.textContent = "Approval note copied";
      setTimeout(() => {
        els.copyApprovalPack.textContent = "Copy approval note";
      }, 1400);
    }
  } catch {
    window.prompt("Copy substitution approval pack", text);
  }
  renderSubstitutionApprovalPack();
}

function downloadSubstitutionApprovalHtml() {
  updateProjectFromFields();
  const approval = substitutionApprovalData();
  const projectSlug = safeFilenamePart(projectValue("name", ""));
  const productSlug = safeFilenamePart(approval.base && approval.candidate ? `${approval.base.brand}-${approval.base.sku}-to-${approval.candidate.brand}-${approval.candidate.sku}` : "substitution-approval");
  const date = new Date().toISOString().slice(0, 10);
  const filename = `InduScout-Substitution-Approval-${productSlug}${projectSlug ? `-${projectSlug}` : ""}-${date}.html`;
  downloadFile(filename, substitutionApprovalHtml(), "text/html;charset=utf-8");
  renderSubstitutionApprovalPack();
}

function exportSubstitutionApprovalJson() {
  updateProjectFromFields();
  const approval = substitutionApprovalData();
  const productSlug = safeFilenamePart(approval.base && approval.candidate ? `${approval.base.brand}-${approval.base.sku}-to-${approval.candidate.brand}-${approval.candidate.sku}` : "substitution-approval");
  const date = new Date().toISOString().slice(0, 10);
  downloadFile(`InduScout-Substitution-Approval-${productSlug}-${date}.json`, JSON.stringify(substitutionApprovalSnapshot(), null, 2), "application/json;charset=utf-8");
  renderSubstitutionApprovalPack();
}

function substitutionApprovalHtml() {
  const approval = substitutionApprovalData();
  const text = substitutionApprovalText();
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>InduScout Substitution Approval</title>
  <style>
    :root { color-scheme: light; }
    body { margin: 0; font-family: Arial, Helvetica, sans-serif; color: #0f172a; background: #eef6f8; }
    main { max-width: 980px; margin: 0 auto; padding: 32px; }
    header, section { background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; margin-bottom: 14px; padding: 20px; }
    h1 { margin: 6px 0 10px; font-size: 32px; line-height: 1.05; }
    p, pre { font-size: 13px; line-height: 1.55; }
    pre { white-space: pre-wrap; font-family: Arial, Helvetica, sans-serif; margin: 0; }
    .eyebrow { color: #00766f; font-size: 12px; font-weight: 800; text-transform: uppercase; }
    .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin: 14px 0; }
    .stat { border: 1px solid #dbe7ef; border-radius: 8px; padding: 12px; }
    .stat span { display: block; color: #64748b; font-size: 11px; font-weight: 800; text-transform: uppercase; }
    .stat strong { display: block; margin-top: 6px; font-size: 22px; }
    button { background: #0f172a; color: #ffffff; border: 0; border-radius: 6px; padding: 10px 14px; font-weight: 800; }
    @media print { body { background: #ffffff; } main { padding: 0; } button { display: none; } header, section { break-inside: avoid; } }
  </style>
</head>
<body>
  <main>
    <header>
      <div class="eyebrow">InduScout substitution approval</div>
      <h1>${escapeHtml(approval.title)}</h1>
      <p>Prepared on ${escapeHtml(formatCopyDate())}. Use this record to support buyer and engineering sign-off before substituting an industrial product.</p>
      <button onclick="window.print()">Save as PDF</button>
    </header>
    <div class="stats">
      <div class="stat"><span>Decision</span><strong>${escapeHtml(approval.setup.decision)}</strong></div>
      <div class="stat"><span>Score</span><strong>${escapeHtml(approval.score)}</strong></div>
      <div class="stat"><span>Checks</span><strong>${escapeHtml(`${approval.completedChecks}/5`)}</strong></div>
      <div class="stat"><span>Risk</span><strong>${escapeHtml(approval.riskLabel)}</strong></div>
    </div>
    <section>
      <pre>${escapeHtml(text)}</pre>
    </section>
  </main>
</body>
</html>`;
}

function landedCostInputs() {
  return [
    els.costProduct,
    els.costSupplier,
    els.costCurrency,
    els.costUnitPrice,
    els.costQuantity,
    els.costFreight,
    els.costDutyRate,
    els.costTaxRate,
    els.costHandling,
    els.costBankCharges,
    els.costFxBuffer,
    els.costDeliveryTerms,
    els.costCountry,
    els.costNotes
  ].filter(Boolean);
}

function defaultLandedCostScenario() {
  return {
    productId: products[0]?.id || "",
    quoteId: "",
    supplier: "",
    currency: "USD",
    unitPrice: "",
    quantity: "1",
    freight: "0",
    dutyRate: "0",
    taxRate: "0",
    handling: "0",
    bankCharges: "0",
    fxBuffer: "0",
    deliveryTerms: "",
    country: "",
    notes: ""
  };
}

function hydrateLandedCostFields() {
  if (!els.costForm) {
    return;
  }

  const setup = sanitizeLandedCostScenario(state.landedCost || {});
  populateCostProducts();
  populateCostQuotes();
  els.costProduct.value = setup.productId;
  els.costQuote.value = setup.quoteId;
  els.costSupplier.value = setup.supplier;
  els.costCurrency.value = setup.currency;
  els.costUnitPrice.value = setup.unitPrice;
  els.costQuantity.value = setup.quantity;
  els.costFreight.value = setup.freight;
  els.costDutyRate.value = setup.dutyRate;
  els.costTaxRate.value = setup.taxRate;
  els.costHandling.value = setup.handling;
  els.costBankCharges.value = setup.bankCharges;
  els.costFxBuffer.value = setup.fxBuffer;
  els.costDeliveryTerms.value = setup.deliveryTerms;
  els.costCountry.value = setup.country;
  els.costNotes.value = setup.notes;
  state.landedCost = landedCostFromFields();
}

function landedCostFromFields() {
  return sanitizeLandedCostScenario({
    productId: els.costProduct?.value || "",
    quoteId: els.costQuote?.value || "",
    supplier: els.costSupplier?.value || "",
    currency: els.costCurrency?.value || "USD",
    unitPrice: els.costUnitPrice?.value || "",
    quantity: els.costQuantity?.value || "",
    freight: els.costFreight?.value || "",
    dutyRate: els.costDutyRate?.value || "",
    taxRate: els.costTaxRate?.value || "",
    handling: els.costHandling?.value || "",
    bankCharges: els.costBankCharges?.value || "",
    fxBuffer: els.costFxBuffer?.value || "",
    deliveryTerms: els.costDeliveryTerms?.value || "",
    country: els.costCountry?.value || "",
    notes: els.costNotes?.value || ""
  });
}

function updateLandedCostFromFields() {
  state.landedCost = landedCostFromFields();
  saveLandedCostScenario();
  renderLandedCostDesk();
}

function saveLandedCostFromFields() {
  updateLandedCostFromFields();
  if (els.saveCostScenario) {
    els.saveCostScenario.textContent = "Scenario saved";
    setTimeout(() => {
      els.saveCostScenario.textContent = "Save scenario";
    }, 1200);
  }
}

function resetLandedCostScenario() {
  state.landedCost = defaultLandedCostScenario();
  saveLandedCostScenario();
  hydrateLandedCostFields();
  renderLandedCostDesk();
}

function applyCostQuoteSelection() {
  if (!els.costQuote) {
    return;
  }

  const quote = state.quotes.find((item) => item.id === els.costQuote.value);
  if (quote) {
    els.costProduct.value = quote.productId || els.costProduct.value;
    els.costSupplier.value = quote.supplier || els.costSupplier.value;
    els.costCurrency.value = quote.currency || els.costCurrency.value;
    els.costUnitPrice.value = quote.unitPrice || els.costUnitPrice.value;
    els.costQuantity.value = quote.quantity || els.costQuantity.value || "1";
    els.costDeliveryTerms.value = quote.deliveryTerms || els.costDeliveryTerms.value;
    els.costCountry.value = quote.deliveryCountry || projectValue("country", "") || els.costCountry.value;
    els.costNotes.value = els.costNotes.value || quote.notes || "";
  }

  updateLandedCostFromFields();
}

function renderLandedCostDesk() {
  if (!els.costStats || !els.costSummary || !els.costPreview) {
    return;
  }

  const cost = landedCostData();
  els.costSummary.textContent = cost.summary;
  els.costStats.innerHTML = [
    costStatTemplate("Landed total", formatMoney(cost.landedTotal, cost.currency), cost.hasCoreCost ? "Estimated delivered cost" : "Add unit price and quantity"),
    costStatTemplate("Landed unit", cost.hasCoreCost ? formatMoney(cost.landedUnit, cost.currency) : "TBC", `${cost.quantity || "0"} unit basis`),
    costStatTemplate("Add-on cost", formatMoney(cost.addOnTotal, cost.currency), `${formatCostPercent(cost.addOnPercent)} above merchandise`),
    costStatTemplate("Review status", cost.statusLabel, cost.missing.length ? `${cost.missing.length} open inputs` : "Buyer review ready")
  ].join("");

  els.costPreview.innerHTML = `
    <article class="cost-card ${escapeHtml(cost.statusClass)}">
      <span>Cost estimate</span>
      <h3>${escapeHtml(cost.title)}</h3>
      <p>${escapeHtml(cost.recommendation)}</p>
      <dl class="cost-facts">
        <div><dt>Supplier</dt><dd>${escapeHtml(cost.supplier || "TBC")}</dd></div>
        <div><dt>Source</dt><dd>${escapeHtml(cost.quote ? "Saved quote" : "Manual estimate")}</dd></div>
        <div><dt>Delivery terms</dt><dd>${escapeHtml(cost.setup.deliveryTerms || "TBC")}</dd></div>
        <div><dt>Delivery country</dt><dd>${escapeHtml(cost.setup.country || "TBC")}</dd></div>
      </dl>
    </article>
    <article class="cost-breakdown">
      <span>Breakdown</span>
      <div class="cost-lines">
        ${costLineTemplate("Merchandise", cost.merchandise, cost.currency)}
        ${costLineTemplate("Freight / shipping", cost.freight, cost.currency)}
        ${costLineTemplate(`Duty ${formatCostPercent(cost.dutyRate)}`, cost.duty, cost.currency)}
        ${costLineTemplate(`Tax / VAT ${formatCostPercent(cost.taxRate)}`, cost.tax, cost.currency)}
        ${costLineTemplate("Handling / clearance", cost.handling, cost.currency)}
        ${costLineTemplate("Bank / payment charges", cost.bankCharges, cost.currency)}
        ${costLineTemplate(`FX / contingency ${formatCostPercent(cost.fxBuffer)}`, cost.buffer, cost.currency)}
      </div>
      <strong>Total: ${escapeHtml(formatMoney(cost.landedTotal, cost.currency))}</strong>
    </article>
    <article class="cost-gaps">
      <span>Buyer checks</span>
      <ul>${cost.missing.length ? cost.missing.map(costGapTemplate).join("") : "<li>Core cost inputs are present. Confirm supplier quote, customs/tax basis, delivery terms, and finance charges before purchase.</li>"}</ul>
      <p>${escapeHtml(cost.setup.notes || "No cost notes entered yet.")}</p>
    </article>
  `;
}

function landedCostData() {
  const setup = sanitizeLandedCostScenario(state.landedCost || {});
  const quote = setup.quoteId ? state.quotes.find((item) => item.id === setup.quoteId) || null : null;
  const product = products.find((item) => item.id === setup.productId) || products.find((item) => item.id === quote?.productId) || products[0] || null;
  const currency = setup.currency || quote?.currency || "USD";
  const unitPrice = parseCostNumber(setup.unitPrice || quote?.unitPrice || "");
  const quantity = parseCostNumber(setup.quantity || quote?.quantity || "1");
  const freight = parseCostNumber(setup.freight);
  const dutyRate = parseCostNumber(setup.dutyRate);
  const taxRate = parseCostNumber(setup.taxRate);
  const handling = parseCostNumber(setup.handling);
  const bankCharges = parseCostNumber(setup.bankCharges);
  const fxBuffer = parseCostNumber(setup.fxBuffer);
  const merchandise = unitPrice * quantity;
  const duty = Math.max(0, (merchandise + freight) * (dutyRate / 100));
  const taxableBase = merchandise + freight + duty + handling;
  const tax = Math.max(0, taxableBase * (taxRate / 100));
  const bufferBase = merchandise + freight + duty + tax + handling + bankCharges;
  const buffer = Math.max(0, bufferBase * (fxBuffer / 100));
  const landedTotal = merchandise + freight + duty + tax + handling + bankCharges + buffer;
  const landedUnit = quantity > 0 ? landedTotal / quantity : 0;
  const addOnTotal = freight + duty + tax + handling + bankCharges + buffer;
  const addOnPercent = merchandise > 0 ? (addOnTotal / merchandise) * 100 : 0;
  const supplier = setup.supplier || quote?.supplier || product?.sources?.[0]?.name || "";
  const missing = landedCostMissingInputs({ setup, quote, unitPrice, quantity, supplier, freight, dutyRate, taxRate });
  const hasCoreCost = unitPrice > 0 && quantity > 0;
  const statusClass = !hasCoreCost ? "blocked" : missing.length > 4 ? "review" : addOnPercent > 35 ? "watch" : "ready";
  const statusLabel = statusClass === "blocked" ? "Cost blocked" : statusClass === "review" ? "Review inputs" : statusClass === "watch" ? "High landed uplift" : "Estimate ready";
  const productName = product ? `${product.brand} ${product.sku}` : "Selected product";
  const title = `${productName} landed cost`;
  const summary = hasCoreCost
    ? `${formatMoney(landedTotal, currency)} landed total | ${formatMoney(landedUnit, currency)} per unit`
    : "Add price and quantity to calculate landed cost";
  const recommendation = landedCostRecommendation({ statusClass, statusLabel, addOnPercent, missing, setup, quote });

  return {
    setup,
    quote,
    product,
    supplier,
    currency,
    unitPrice,
    quantity,
    freight,
    dutyRate,
    taxRate,
    handling,
    bankCharges,
    fxBuffer,
    merchandise,
    duty,
    tax,
    buffer,
    landedTotal,
    landedUnit,
    addOnTotal,
    addOnPercent,
    missing,
    hasCoreCost,
    statusClass,
    statusLabel,
    title,
    summary,
    recommendation
  };
}

function landedCostMissingInputs({ setup, quote, unitPrice, quantity, supplier, freight, dutyRate, taxRate }) {
  const missing = [];
  if (!unitPrice) {
    missing.push("Add quoted unit price.");
  }
  if (!quantity) {
    missing.push("Add buyer quantity.");
  }
  if (!supplier) {
    missing.push("Add supplier name or link a saved quote.");
  }
  if (!setup.deliveryTerms) {
    missing.push("Confirm delivery terms, such as EXW, FCA, DAP, or delivered.");
  }
  if (!setup.country) {
    missing.push("Add delivery country for tax, duty, and logistics review.");
  }
  if (!quote) {
    missing.push("Link a saved quote when possible so the cost estimate has evidence.");
  }
  if (!freight) {
    missing.push("Confirm freight, courier, or shipping charge.");
  }
  if (!dutyRate && !taxRate) {
    missing.push("Confirm duty and tax/VAT treatment for the delivery country.");
  }
  return missing.slice(0, 8);
}

function landedCostRecommendation({ statusClass, statusLabel, addOnPercent, missing, setup, quote }) {
  if (statusClass === "blocked") {
    return "Cost estimate is blocked until unit price and quantity are entered.";
  }
  if (addOnPercent > 35) {
    return `Delivered cost uplift is ${formatCostPercent(addOnPercent)}. Review freight, customs, VAT, and buffer before comparing suppliers.`;
  }
  if (missing.length) {
    return `${statusLabel}. Use this as a working estimate and close the open buyer checks before order approval.`;
  }
  if (quote) {
    return "Ready as a buyer-side landed cost estimate from a saved quote, subject to final supplier, freight, tax, and customs validation.";
  }
  return "Ready as a manual landed cost estimate. Link a quote later for stronger evidence.";
}

function costStatTemplate(label, value, detail) {
  return `
    <article class="cost-stat">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
      <small>${escapeHtml(detail)}</small>
    </article>
  `;
}

function costLineTemplate(label, value, currency) {
  return `
    <div>
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(formatMoney(value, currency))}</strong>
    </div>
  `;
}

function costGapTemplate(item) {
  return `<li>${escapeHtml(item)}</li>`;
}

function landedCostText() {
  const cost = landedCostData();
  const product = cost.product;
  const sourceLine = cost.quote
    ? `Saved quote: ${cost.quote.supplier} | ${quoteTotalLabel(cost.quote)} | lead ${cost.quote.leadTime || "TBC"}`
    : "Saved quote: Not linked";
  const missingLines = cost.missing.length
    ? cost.missing.map((item) => `- ${item}`).join("\n")
    : "- Core cost inputs are present. Confirm final supplier, freight, tax, duty, and payment terms before purchase.";

  return `InduScout landed cost estimate
Prepared on ${formatCopyDate()}

Project: ${projectValue("name", "TBC")}
Buyer/company: ${projectValue("buyer", "TBC")}
Delivery country: ${cost.setup.country || projectValue("country", "TBC")}
Target date: ${projectValue("targetDate", "TBC")}

Product: ${product ? `${product.brand} ${product.sku} - ${product.name}` : "TBC"}
Category: ${product ? product.category : "TBC"}
Supplier: ${cost.supplier || "TBC"}
${sourceLine}
Delivery terms: ${cost.setup.deliveryTerms || "TBC"}

Cost inputs:
- Unit price: ${cost.currency} ${cost.setup.unitPrice || "TBC"}
- Quantity: ${cost.setup.quantity || "TBC"}
- Freight / shipping: ${cost.currency} ${cost.setup.freight || "0"}
- Duty rate: ${formatCostPercent(cost.dutyRate)}
- Tax / VAT rate: ${formatCostPercent(cost.taxRate)}
- Handling / clearance: ${cost.currency} ${cost.setup.handling || "0"}
- Bank / payment charges: ${cost.currency} ${cost.setup.bankCharges || "0"}
- FX / contingency buffer: ${formatCostPercent(cost.fxBuffer)}

Landed cost estimate:
- Merchandise: ${formatMoney(cost.merchandise, cost.currency)}
- Duty: ${formatMoney(cost.duty, cost.currency)}
- Tax / VAT: ${formatMoney(cost.tax, cost.currency)}
- Buyer-side add-ons: ${formatMoney(cost.addOnTotal, cost.currency)} (${formatCostPercent(cost.addOnPercent)} uplift)
- Landed total: ${formatMoney(cost.landedTotal, cost.currency)}
- Landed unit: ${cost.hasCoreCost ? formatMoney(cost.landedUnit, cost.currency) : "TBC"}

Status:
${cost.statusLabel}
${cost.recommendation}

Open buyer checks:
${missingLines}

Cost notes:
${cost.setup.notes || "None recorded."}

Verification checklist before order:
- Confirm supplier quote, currency, stock, lead time, validity, and seller legitimacy.
- Confirm Incoterms or delivery terms and which party pays freight, insurance, duty, VAT, and clearance.
- Confirm country-specific customs tariff, VAT/GST, payment charges, and exchange-rate basis.
- Confirm warranty path, certificate availability, datasheet revision, and exact part configuration.
- Treat this as an estimate until finance, logistics, and supplier confirmations are closed.

InduScout is a discovery and RFQ preparation aid. Final landed cost validation remains with the buyer, finance/logistics team, customs broker, and supplier.`;
}

function landedCostSnapshot() {
  const cost = landedCostData();
  return {
    ...createSessionSnapshot(),
    landedCostEstimate: {
      generatedAt: new Date().toISOString(),
      setup: cost.setup,
      product: cost.product,
      quote: cost.quote,
      supplier: cost.supplier,
      currency: cost.currency,
      merchandise: cost.merchandise,
      addOnTotal: cost.addOnTotal,
      landedTotal: cost.landedTotal,
      landedUnit: cost.landedUnit,
      statusLabel: cost.statusLabel,
      missingInputs: cost.missing,
      generatedText: landedCostText()
    }
  };
}

async function copyLandedCostBrief() {
  updateProjectFromFields();
  const text = landedCostText();
  try {
    await navigator.clipboard.writeText(text);
    if (els.copyCostBrief) {
      els.copyCostBrief.textContent = "Cost brief copied";
      setTimeout(() => {
        els.copyCostBrief.textContent = "Copy cost brief";
      }, 1400);
    }
  } catch {
    window.prompt("Copy landed cost brief", text);
  }
  renderLandedCostDesk();
}

function downloadLandedCostHtml() {
  updateProjectFromFields();
  const cost = landedCostData();
  const projectSlug = safeFilenamePart(projectValue("name", ""));
  const productSlug = safeFilenamePart(cost.product ? `${cost.product.brand}-${cost.product.sku}` : "landed-cost");
  const date = new Date().toISOString().slice(0, 10);
  const filename = `InduScout-Landed-Cost-${productSlug}${projectSlug ? `-${projectSlug}` : ""}-${date}.html`;
  downloadFile(filename, landedCostHtml(), "text/html;charset=utf-8");
  renderLandedCostDesk();
}

function exportLandedCostJson() {
  updateProjectFromFields();
  const cost = landedCostData();
  const productSlug = safeFilenamePart(cost.product ? `${cost.product.brand}-${cost.product.sku}` : "landed-cost");
  const date = new Date().toISOString().slice(0, 10);
  downloadFile(`InduScout-Landed-Cost-${productSlug}-${date}.json`, JSON.stringify(landedCostSnapshot(), null, 2), "application/json;charset=utf-8");
  renderLandedCostDesk();
}

function landedCostHtml() {
  const cost = landedCostData();
  const text = landedCostText();
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>InduScout Landed Cost Estimate</title>
  <style>
    :root { color-scheme: light; }
    body { margin: 0; font-family: Arial, Helvetica, sans-serif; color: #0f172a; background: #eef6f8; }
    main { max-width: 980px; margin: 0 auto; padding: 32px; }
    header, section { background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; margin-bottom: 14px; padding: 20px; }
    h1 { margin: 6px 0 10px; font-size: 32px; line-height: 1.05; }
    p, pre { font-size: 13px; line-height: 1.55; }
    pre { white-space: pre-wrap; font-family: Arial, Helvetica, sans-serif; margin: 0; }
    .eyebrow { color: #00766f; font-size: 12px; font-weight: 800; text-transform: uppercase; }
    .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin: 14px 0; }
    .stat { border: 1px solid #dbe7ef; border-radius: 8px; padding: 12px; }
    .stat span { display: block; color: #64748b; font-size: 11px; font-weight: 800; text-transform: uppercase; }
    .stat strong { display: block; margin-top: 6px; font-size: 22px; }
    button { background: #0f172a; color: #ffffff; border: 0; border-radius: 6px; padding: 10px 14px; font-weight: 800; }
    @media print { body { background: #ffffff; } main { padding: 0; } button { display: none; } header, section { break-inside: avoid; } }
  </style>
</head>
<body>
  <main>
    <header>
      <div class="eyebrow">InduScout landed cost</div>
      <h1>${escapeHtml(cost.title)}</h1>
      <p>Prepared on ${escapeHtml(formatCopyDate())}. Use this as a buyer-side delivered-cost estimate before final order approval.</p>
      <button onclick="window.print()">Save as PDF</button>
    </header>
    <div class="stats">
      <div class="stat"><span>Total</span><strong>${escapeHtml(formatMoney(cost.landedTotal, cost.currency))}</strong></div>
      <div class="stat"><span>Unit</span><strong>${escapeHtml(cost.hasCoreCost ? formatMoney(cost.landedUnit, cost.currency) : "TBC")}</strong></div>
      <div class="stat"><span>Uplift</span><strong>${escapeHtml(formatCostPercent(cost.addOnPercent))}</strong></div>
      <div class="stat"><span>Status</span><strong>${escapeHtml(cost.statusLabel)}</strong></div>
    </div>
    <section>
      <pre>${escapeHtml(text)}</pre>
    </section>
  </main>
</body>
</html>`;
}

function parseCostNumber(value) {
  const match = String(value || "").replace(/,/g, "").match(/\d+(\.\d+)?/);
  return match ? Number(match[0]) : 0;
}

function formatMoney(value, currency = "USD") {
  const amount = Number.isFinite(value) ? value : 0;
  return `${currency || "USD"} ${formatAmount(amount)}`;
}

function formatCostPercent(value) {
  const number = Number.isFinite(value) ? value : 0;
  return `${formatAmount(number)}%`;
}

function negotiationInputs() {
  return [
    els.negotiationProduct,
    els.negotiationSupplier,
    els.negotiationCurrency,
    els.negotiationCurrentPrice,
    els.negotiationQuantity,
    els.negotiationTargetPrice,
    els.negotiationDiscount,
    els.negotiationLeadTime,
    els.negotiationValidity,
    els.negotiationLeverage,
    els.negotiationReason,
    els.negotiationNotes
  ].filter(Boolean);
}

function defaultNegotiationPlan() {
  return {
    productId: products[0]?.id || "",
    quoteId: "",
    supplier: "",
    currency: "USD",
    currentPrice: "",
    quantity: "1",
    targetPrice: "",
    discount: "10",
    targetLeadTime: "",
    validity: "Hold price for 30 days",
    leverage: "Standard commercial review",
    reason: "Align with buyer budget and comparable market options",
    notes: ""
  };
}

function hydrateNegotiationFields() {
  if (!els.negotiationForm) {
    return;
  }

  const plan = sanitizeNegotiationPlan(state.negotiationPlan || {});
  populateNegotiationProducts();
  populateNegotiationQuotes();
  els.negotiationProduct.value = plan.productId;
  els.negotiationQuote.value = plan.quoteId;
  els.negotiationSupplier.value = plan.supplier;
  els.negotiationCurrency.value = plan.currency;
  els.negotiationCurrentPrice.value = plan.currentPrice;
  els.negotiationQuantity.value = plan.quantity;
  els.negotiationTargetPrice.value = plan.targetPrice;
  els.negotiationDiscount.value = plan.discount;
  els.negotiationLeadTime.value = plan.targetLeadTime;
  els.negotiationValidity.value = plan.validity;
  els.negotiationLeverage.value = plan.leverage;
  els.negotiationReason.value = plan.reason;
  els.negotiationNotes.value = plan.notes;
  state.negotiationPlan = negotiationFromFields();
}

function negotiationFromFields() {
  return sanitizeNegotiationPlan({
    productId: els.negotiationProduct?.value || "",
    quoteId: els.negotiationQuote?.value || "",
    supplier: els.negotiationSupplier?.value || "",
    currency: els.negotiationCurrency?.value || "USD",
    currentPrice: els.negotiationCurrentPrice?.value || "",
    quantity: els.negotiationQuantity?.value || "",
    targetPrice: els.negotiationTargetPrice?.value || "",
    discount: els.negotiationDiscount?.value || "",
    targetLeadTime: els.negotiationLeadTime?.value || "",
    validity: els.negotiationValidity?.value || "",
    leverage: els.negotiationLeverage?.value || "Standard commercial review",
    reason: els.negotiationReason?.value || "",
    notes: els.negotiationNotes?.value || ""
  });
}

function updateNegotiationFromFields() {
  state.negotiationPlan = negotiationFromFields();
  saveNegotiationPlan();
  renderNegotiationDesk();
}

function saveNegotiationFromFields() {
  updateNegotiationFromFields();
  if (els.saveNegotiationPlan) {
    els.saveNegotiationPlan.textContent = "Plan saved";
    setTimeout(() => {
      els.saveNegotiationPlan.textContent = "Save plan";
    }, 1200);
  }
}

function resetNegotiationPlan() {
  state.negotiationPlan = defaultNegotiationPlan();
  saveNegotiationPlan();
  hydrateNegotiationFields();
  renderNegotiationDesk();
}

function applyNegotiationQuoteSelection() {
  if (!els.negotiationQuote) {
    return;
  }

  const quote = state.quotes.find((item) => item.id === els.negotiationQuote.value);
  if (quote) {
    els.negotiationProduct.value = quote.productId || els.negotiationProduct.value;
    els.negotiationSupplier.value = quote.supplier || els.negotiationSupplier.value;
    els.negotiationCurrency.value = quote.currency || els.negotiationCurrency.value;
    els.negotiationCurrentPrice.value = quote.unitPrice || els.negotiationCurrentPrice.value;
    els.negotiationQuantity.value = quote.quantity || els.negotiationQuantity.value || "1";
    els.negotiationLeadTime.value = quote.leadTime || els.negotiationLeadTime.value;
    els.negotiationValidity.value = quote.validUntil ? `Extend or confirm validity beyond ${quote.validUntil}` : els.negotiationValidity.value;
    els.negotiationNotes.value = els.negotiationNotes.value || quote.notes || "";
  }

  updateNegotiationFromFields();
}

function renderNegotiationDesk() {
  if (!els.negotiationStats || !els.negotiationSummary || !els.negotiationPreview) {
    return;
  }

  const plan = negotiationData();
  els.negotiationSummary.textContent = plan.summary;
  els.negotiationStats.innerHTML = [
    negotiationStatTemplate("Current total", plan.hasCurrent ? formatMoney(plan.currentTotal, plan.currency) : "TBC", "Quote basis"),
    negotiationStatTemplate("Target total", plan.hasTarget ? formatMoney(plan.targetTotal, plan.currency) : "TBC", "Buyer ask"),
    negotiationStatTemplate("Savings", plan.hasSavings ? formatMoney(plan.savings, plan.currency) : "TBC", `${formatCostPercent(plan.savingsPercent)} potential reduction`),
    negotiationStatTemplate("Status", plan.statusLabel, plan.openChecks.length ? `${plan.openChecks.length} open checks` : "Ready to copy")
  ].join("");

  els.negotiationPreview.innerHTML = `
    <article class="negotiation-card ${escapeHtml(plan.statusClass)}">
      <span>Negotiation plan</span>
      <h3>${escapeHtml(plan.title)}</h3>
      <p>${escapeHtml(plan.recommendation)}</p>
      <dl class="negotiation-facts">
        <div><dt>Supplier</dt><dd>${escapeHtml(plan.supplier || "TBC")}</dd></div>
        <div><dt>Leverage</dt><dd>${escapeHtml(plan.setup.leverage || "TBC")}</dd></div>
        <div><dt>Target lead time</dt><dd>${escapeHtml(plan.setup.targetLeadTime || "TBC")}</dd></div>
        <div><dt>Validity ask</dt><dd>${escapeHtml(plan.setup.validity || "TBC")}</dd></div>
      </dl>
    </article>
    <article class="negotiation-email">
      <span>Commercial ask</span>
      <h3>${escapeHtml(plan.askHeadline)}</h3>
      <div class="negotiation-lines">
        ${negotiationLineTemplate("Current unit", plan.hasCurrent ? formatMoney(plan.currentPrice, plan.currency) : "TBC")}
        ${negotiationLineTemplate("Target unit", plan.hasTarget ? formatMoney(plan.targetPrice, plan.currency) : "TBC")}
        ${negotiationLineTemplate("Requested discount", formatCostPercent(plan.requestedDiscount))}
        ${negotiationLineTemplate("Quantity basis", plan.setup.quantity || "TBC")}
      </div>
    </article>
    <article class="negotiation-checks">
      <span>Buyer checks</span>
      <ul>${plan.openChecks.length ? plan.openChecks.map((item) => `<li>${escapeHtml(item)}</li>`).join("") : "<li>Core negotiation inputs are ready. Keep quote evidence and approval limits attached to the buyer file.</li>"}</ul>
      <p>${escapeHtml(plan.setup.notes || "No negotiation notes entered yet.")}</p>
    </article>
  `;
}

function negotiationData() {
  const setup = sanitizeNegotiationPlan(state.negotiationPlan || {});
  const quote = setup.quoteId ? state.quotes.find((item) => item.id === setup.quoteId) || null : null;
  const product = products.find((item) => item.id === setup.productId) || products.find((item) => item.id === quote?.productId) || products[0] || null;
  const currency = setup.currency || quote?.currency || "USD";
  const currentPrice = parseCostNumber(setup.currentPrice || quote?.unitPrice || "");
  const quantity = parseCostNumber(setup.quantity || quote?.quantity || "1");
  const requestedDiscount = parseCostNumber(setup.discount);
  const enteredTarget = parseCostNumber(setup.targetPrice);
  const computedTarget = currentPrice > 0 && requestedDiscount > 0 ? currentPrice * (1 - requestedDiscount / 100) : 0;
  const targetPrice = enteredTarget || computedTarget;
  const currentTotal = currentPrice * quantity;
  const targetTotal = targetPrice * quantity;
  const savings = Math.max(0, currentTotal - targetTotal);
  const savingsPercent = currentTotal > 0 ? (savings / currentTotal) * 100 : 0;
  const supplier = setup.supplier || quote?.supplier || product?.sources?.[0]?.name || "";
  const hasCurrent = currentPrice > 0 && quantity > 0;
  const hasTarget = targetPrice > 0 && quantity > 0;
  const hasSavings = hasCurrent && hasTarget && savings > 0;
  const openChecks = negotiationOpenChecks({ setup, quote, currentPrice, targetPrice, quantity, supplier });
  const statusClass = !hasCurrent || !hasTarget ? "blocked" : savingsPercent > 35 ? "review" : openChecks.length > 4 ? "review" : "ready";
  const statusLabel = statusClass === "blocked" ? "Needs price target" : statusClass === "review" ? "Review ask" : "Ready to negotiate";
  const productName = product ? `${product.brand} ${product.sku}` : "Selected product";
  const title = `${productName} commercial negotiation`;
  const askHeadline = hasTarget
    ? `Ask ${supplier || "supplier"} for ${formatMoney(targetPrice, currency)} unit pricing`
    : "Add a target price or discount";
  const summary = hasSavings
    ? `${formatMoney(savings, currency)} potential savings | ${formatCostPercent(savingsPercent)} reduction`
    : "Add quote price, quantity, and target to estimate savings";
  const recommendation = negotiationRecommendation({ statusClass, savingsPercent, openChecks, quote });

  return {
    setup,
    quote,
    product,
    supplier,
    currency,
    currentPrice,
    quantity,
    requestedDiscount: enteredTarget && currentPrice > 0 ? Math.max(0, ((currentPrice - enteredTarget) / currentPrice) * 100) : requestedDiscount,
    targetPrice,
    currentTotal,
    targetTotal,
    savings,
    savingsPercent,
    hasCurrent,
    hasTarget,
    hasSavings,
    openChecks,
    statusClass,
    statusLabel,
    title,
    askHeadline,
    summary,
    recommendation
  };
}

function negotiationOpenChecks({ setup, quote, currentPrice, targetPrice, quantity, supplier }) {
  const checks = [];
  if (!currentPrice) {
    checks.push("Add current quoted unit price.");
  }
  if (!quantity) {
    checks.push("Add buyer quantity.");
  }
  if (!targetPrice) {
    checks.push("Add target unit price or requested discount.");
  }
  if (!supplier) {
    checks.push("Add supplier name or link a saved quote.");
  }
  if (!quote) {
    checks.push("Link a saved quote when possible for stronger evidence.");
  }
  if (!setup.reason) {
    checks.push("Add a concise negotiation reason.");
  }
  if (!setup.targetLeadTime) {
    checks.push("Add target lead time or confirm current lead time is acceptable.");
  }
  if (!setup.validity) {
    checks.push("Ask supplier to confirm quote validity.");
  }
  return checks.slice(0, 8);
}

function negotiationRecommendation({ statusClass, savingsPercent, openChecks, quote }) {
  if (statusClass === "blocked") {
    return "Negotiation is blocked until current price, quantity, and target price or discount are entered.";
  }
  if (savingsPercent > 35) {
    return "This is an aggressive commercial ask. Use clear justification, competing evidence, or volume leverage before sending.";
  }
  if (openChecks.length) {
    return "Use this as a draft counter-offer and close open buyer checks before sending to the supplier.";
  }
  if (quote) {
    return "Ready to send as a supplier counter-offer based on the saved quote and buyer target.";
  }
  return "Ready as a manual negotiation draft. Linking a saved quote will strengthen the audit trail.";
}

function negotiationStatTemplate(label, value, detail) {
  return `
    <article class="negotiation-stat">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
      <small>${escapeHtml(detail)}</small>
    </article>
  `;
}

function negotiationLineTemplate(label, value) {
  return `
    <div>
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
    </div>
  `;
}

function negotiationSupplierEmailText() {
  const plan = negotiationData();
  const product = plan.product;
  return `Subject: Commercial review request - ${product ? `${product.brand} ${product.sku}` : "quoted item"}

Dear ${plan.supplier || "Supplier"},

Thank you for the quotation.

We are reviewing the commercial position for the following item:

Product: ${product ? `${product.brand} ${product.sku} - ${product.name}` : "TBC"}
Project: ${projectValue("name", "TBC")}
Delivery country: ${projectValue("country", "TBC")}
Quantity basis: ${plan.setup.quantity || "TBC"}

Current quoted unit price: ${plan.hasCurrent ? formatMoney(plan.currentPrice, plan.currency) : "TBC"}
Target unit price requested: ${plan.hasTarget ? formatMoney(plan.targetPrice, plan.currency) : "TBC"}
Estimated target total: ${plan.hasTarget ? formatMoney(plan.targetTotal, plan.currency) : "TBC"}
Requested improvement: ${formatCostPercent(plan.requestedDiscount)}
Target lead time: ${plan.setup.targetLeadTime || "Please confirm best available lead time"}
Quote validity request: ${plan.setup.validity || "Please confirm quote validity"}

Commercial reason:
${plan.setup.reason || "Buyer commercial review before approval."}

Buyer context:
${plan.setup.leverage || "Standard commercial review"}

Please confirm whether you can support the target pricing and lead time, or provide your best revised offer with:
- Final unit price and currency.
- Stock position and lead time.
- Quote validity.
- Delivery terms and freight scope.
- Warranty path and certificate/datasheet availability.
- Any MOQ, payment, or country-of-origin conditions.

Buyer notes:
${plan.setup.notes || "No additional notes."}

Regards,
${projectValue("buyer", "Buyer")}`;
}

function negotiationSavingsNoteText() {
  const plan = negotiationData();
  const product = plan.product;
  const openChecks = plan.openChecks.length
    ? plan.openChecks.map((item) => `- ${item}`).join("\n")
    : "- Core negotiation inputs are present.";

  return `InduScout negotiation and savings note
Prepared on ${formatCopyDate()}

Project: ${projectValue("name", "TBC")}
Buyer/company: ${projectValue("buyer", "TBC")}

Product: ${product ? `${product.brand} ${product.sku} - ${product.name}` : "TBC"}
Supplier: ${plan.supplier || "TBC"}
Quote source: ${plan.quote ? "Saved quote linked" : "Manual estimate"}

Commercial baseline:
- Current unit price: ${plan.hasCurrent ? formatMoney(plan.currentPrice, plan.currency) : "TBC"}
- Quantity: ${plan.setup.quantity || "TBC"}
- Current total: ${plan.hasCurrent ? formatMoney(plan.currentTotal, plan.currency) : "TBC"}

Negotiation target:
- Target unit price: ${plan.hasTarget ? formatMoney(plan.targetPrice, plan.currency) : "TBC"}
- Target total: ${plan.hasTarget ? formatMoney(plan.targetTotal, plan.currency) : "TBC"}
- Potential savings: ${plan.hasSavings ? formatMoney(plan.savings, plan.currency) : "TBC"}
- Potential reduction: ${formatCostPercent(plan.savingsPercent)}
- Target lead time: ${plan.setup.targetLeadTime || "TBC"}
- Validity request: ${plan.setup.validity || "TBC"}

Buyer leverage:
${plan.setup.leverage || "TBC"}

Negotiation reason:
${plan.setup.reason || "TBC"}

Open checks:
${openChecks}

Buyer notes:
${plan.setup.notes || "None recorded."}

InduScout is a discovery and RFQ preparation aid. Final commercial negotiation, supplier acceptance, and savings recognition remain with the buyer and supplier.`;
}

function negotiationSnapshot() {
  const plan = negotiationData();
  return {
    ...createSessionSnapshot(),
    negotiationPack: {
      generatedAt: new Date().toISOString(),
      setup: plan.setup,
      product: plan.product,
      quote: plan.quote,
      supplier: plan.supplier,
      currency: plan.currency,
      currentTotal: plan.currentTotal,
      targetTotal: plan.targetTotal,
      savings: plan.savings,
      savingsPercent: plan.savingsPercent,
      statusLabel: plan.statusLabel,
      openChecks: plan.openChecks,
      supplierEmail: negotiationSupplierEmailText(),
      savingsNote: negotiationSavingsNoteText()
    }
  };
}

async function copyNegotiationEmail() {
  updateProjectFromFields();
  const text = negotiationSupplierEmailText();
  try {
    await navigator.clipboard.writeText(text);
    if (els.copyNegotiationEmail) {
      els.copyNegotiationEmail.textContent = "Email copied";
      setTimeout(() => {
        els.copyNegotiationEmail.textContent = "Copy supplier email";
      }, 1400);
    }
  } catch {
    window.prompt("Copy supplier negotiation email", text);
  }
  renderNegotiationDesk();
}

async function copyNegotiationSavingsNote() {
  updateProjectFromFields();
  const text = negotiationSavingsNoteText();
  try {
    await navigator.clipboard.writeText(text);
    if (els.copySavingsNote) {
      els.copySavingsNote.textContent = "Savings note copied";
      setTimeout(() => {
        els.copySavingsNote.textContent = "Copy savings note";
      }, 1400);
    }
  } catch {
    window.prompt("Copy negotiation savings note", text);
  }
  renderNegotiationDesk();
}

function downloadNegotiationHtml() {
  updateProjectFromFields();
  const plan = negotiationData();
  const projectSlug = safeFilenamePart(projectValue("name", ""));
  const productSlug = safeFilenamePart(plan.product ? `${plan.product.brand}-${plan.product.sku}` : "negotiation");
  const date = new Date().toISOString().slice(0, 10);
  const filename = `InduScout-Negotiation-${productSlug}${projectSlug ? `-${projectSlug}` : ""}-${date}.html`;
  downloadFile(filename, negotiationHtml(), "text/html;charset=utf-8");
  renderNegotiationDesk();
}

function exportNegotiationJson() {
  updateProjectFromFields();
  const plan = negotiationData();
  const productSlug = safeFilenamePart(plan.product ? `${plan.product.brand}-${plan.product.sku}` : "negotiation");
  const date = new Date().toISOString().slice(0, 10);
  downloadFile(`InduScout-Negotiation-${productSlug}-${date}.json`, JSON.stringify(negotiationSnapshot(), null, 2), "application/json;charset=utf-8");
  renderNegotiationDesk();
}

function negotiationHtml() {
  const plan = negotiationData();
  const text = negotiationSavingsNoteText();
  const email = negotiationSupplierEmailText();
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>InduScout Negotiation Pack</title>
  <style>
    :root { color-scheme: light; }
    body { margin: 0; font-family: Arial, Helvetica, sans-serif; color: #0f172a; background: #eef6f8; }
    main { max-width: 980px; margin: 0 auto; padding: 32px; }
    header, section { background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; margin-bottom: 14px; padding: 20px; }
    h1 { margin: 6px 0 10px; font-size: 32px; line-height: 1.05; }
    p, pre { font-size: 13px; line-height: 1.55; }
    pre { white-space: pre-wrap; font-family: Arial, Helvetica, sans-serif; margin: 0; }
    .eyebrow { color: #00766f; font-size: 12px; font-weight: 800; text-transform: uppercase; }
    .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin: 14px 0; }
    .stat { border: 1px solid #dbe7ef; border-radius: 8px; padding: 12px; }
    .stat span { display: block; color: #64748b; font-size: 11px; font-weight: 800; text-transform: uppercase; }
    .stat strong { display: block; margin-top: 6px; font-size: 22px; }
    button { background: #0f172a; color: #ffffff; border: 0; border-radius: 6px; padding: 10px 14px; font-weight: 800; }
    @media print { body { background: #ffffff; } main { padding: 0; } button { display: none; } header, section { break-inside: avoid; } }
  </style>
</head>
<body>
  <main>
    <header>
      <div class="eyebrow">InduScout negotiation pack</div>
      <h1>${escapeHtml(plan.title)}</h1>
      <p>Prepared on ${escapeHtml(formatCopyDate())}. Use this pack to support supplier counter-offer review and buyer savings discussion.</p>
      <button onclick="window.print()">Save as PDF</button>
    </header>
    <div class="stats">
      <div class="stat"><span>Current</span><strong>${escapeHtml(plan.hasCurrent ? formatMoney(plan.currentTotal, plan.currency) : "TBC")}</strong></div>
      <div class="stat"><span>Target</span><strong>${escapeHtml(plan.hasTarget ? formatMoney(plan.targetTotal, plan.currency) : "TBC")}</strong></div>
      <div class="stat"><span>Savings</span><strong>${escapeHtml(plan.hasSavings ? formatMoney(plan.savings, plan.currency) : "TBC")}</strong></div>
      <div class="stat"><span>Status</span><strong>${escapeHtml(plan.statusLabel)}</strong></div>
    </div>
    <section>
      <h2>Buyer savings note</h2>
      <pre>${escapeHtml(text)}</pre>
    </section>
    <section>
      <h2>Supplier email</h2>
      <pre>${escapeHtml(email)}</pre>
    </section>
  </main>
</body>
</html>`;
}

function selectedSavingsProduct() {
  return products.find((product) => product.id === els.savingsProduct?.value) || products[0];
}

function savingsFieldValue(element, fallback = "") {
  const value = String(element?.value || "").trim();
  return value || fallback;
}

function defaultSavingsRecord() {
  const product = products[0];
  return {
    id: "",
    productId: product?.id || "",
    quoteId: "",
    supplier: "",
    currency: "USD",
    baselineUnit: "",
    finalUnit: "",
    quantity: "1",
    status: "Target set",
    owner: "",
    evidenceUrl: "",
    decisionDate: "",
    notes: ""
  };
}

function hydrateSavingsForm(record = {}) {
  if (!els.savingsForm) {
    return;
  }

  const data = { ...defaultSavingsRecord(), ...record };
  const productId = data.productId && products.some((product) => product.id === data.productId) ? data.productId : products[0]?.id || "";
  populateSavingsProducts();
  populateSavingsQuotes();
  els.savingsId.value = data.id || "";
  els.savingsProduct.value = productId;
  els.savingsQuote.value = data.quoteId && state.quotes.some((quote) => quote.id === data.quoteId) ? data.quoteId : "";
  els.savingsSupplier.value = data.supplier || "";
  els.savingsCurrency.value = data.currency || "USD";
  els.savingsBaselineUnit.value = data.baselineUnit || "";
  els.savingsFinalUnit.value = data.finalUnit || "";
  els.savingsQuantity.value = data.quantity || "1";
  els.savingsStatus.value = data.status || "Target set";
  els.savingsOwner.value = data.owner || projectValue("buyer", "");
  els.savingsEvidenceUrl.value = data.evidenceUrl || "";
  els.savingsDate.value = data.decisionDate || "";
  els.savingsNotes.value = data.notes || "";
}

function savingsFormSnapshot() {
  updateProjectFromFields();
  const product = selectedSavingsProduct();
  const existing = state.savingsRecords.find((record) => record.id === els.savingsId?.value);
  const supplier = savingsFieldValue(els.savingsSupplier, "Supplier TBC");
  return sanitizeSavingsRecord({
    id: savingsFieldValue(els.savingsId, `${Date.now()}-${safeFilenamePart(`${supplier}-${product?.sku || "savings"}`).toLowerCase() || "savings"}`),
    savedAt: existing?.savedAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    projectName: projectValue("name", ""),
    buyer: projectValue("buyer", ""),
    buyerContact: projectValue("contact", ""),
    deliveryCountry: projectValue("country", ""),
    targetDate: projectValue("targetDate", ""),
    productId: product?.id || "",
    quoteId: els.savingsQuote?.value || "",
    brand: product?.brand || "",
    sku: product?.sku || "",
    productName: product?.name || "",
    category: product?.category || "",
    supplier,
    currency: savingsFieldValue(els.savingsCurrency, "USD"),
    baselineUnit: savingsFieldValue(els.savingsBaselineUnit, ""),
    finalUnit: savingsFieldValue(els.savingsFinalUnit, ""),
    quantity: savingsFieldValue(els.savingsQuantity, "1"),
    status: savingsFieldValue(els.savingsStatus, "Target set"),
    owner: savingsFieldValue(els.savingsOwner, projectValue("buyer", "")),
    evidenceUrl: savingsFieldValue(els.savingsEvidenceUrl, ""),
    decisionDate: savingsFieldValue(els.savingsDate, ""),
    notes: savingsFieldValue(els.savingsNotes, "")
  });
}

function prefillSavingsFromQuote() {
  const quote = state.quotes.find((item) => item.id === els.savingsQuote?.value);
  if (!quote) {
    return;
  }

  els.savingsProduct.value = quote.productId || els.savingsProduct.value;
  els.savingsSupplier.value = quote.supplier || els.savingsSupplier.value;
  els.savingsCurrency.value = quote.currency || els.savingsCurrency.value;
  els.savingsBaselineUnit.value = quote.unitPrice || els.savingsBaselineUnit.value;
  els.savingsQuantity.value = quote.quantity || els.savingsQuantity.value || "1";
  els.savingsEvidenceUrl.value = quote.sourceUrl || els.savingsEvidenceUrl.value;
  els.savingsNotes.value = els.savingsNotes.value || quote.notes || "";
}

function useNegotiationPlanForSavings() {
  if (!els.savingsForm) {
    return;
  }
  const plan = negotiationData();
  hydrateSavingsForm({
    productId: plan.product?.id || plan.setup.productId,
    quoteId: plan.setup.quoteId,
    supplier: plan.supplier,
    currency: plan.currency,
    baselineUnit: plan.hasCurrent ? String(plan.currentPrice) : plan.setup.currentPrice,
    finalUnit: plan.hasTarget ? String(plan.targetPrice) : plan.setup.targetPrice,
    quantity: plan.setup.quantity || "1",
    status: "Target set",
    owner: projectValue("buyer", ""),
    evidenceUrl: plan.quote?.sourceUrl || "",
    decisionDate: new Date().toISOString().slice(0, 10),
    notes: plan.setup.notes || plan.setup.reason || ""
  });
  renderSavingsRegister();
}

function saveSavingsRecordFromForm() {
  if (!els.savingsForm) {
    return;
  }

  const record = savingsFormSnapshot();
  if (!record.supplier || record.supplier === "Supplier TBC") {
    els.saveSavingsRecord.textContent = "Add supplier first";
    setTimeout(() => {
      els.saveSavingsRecord.textContent = "Save savings";
    }, 1200);
    return;
  }

  state.savingsRecords = [record, ...state.savingsRecords.filter((item) => item.id !== record.id)].slice(0, 120);
  saveSavingsRecords();
  hydrateSavingsForm(record);
  renderSavingsRegister();
  renderPlaybookLab();
  renderGovernanceCenter();
  els.saveSavingsRecord.textContent = "Savings saved";
  setTimeout(() => {
    els.saveSavingsRecord.textContent = "Save savings";
  }, 1200);
}

function clearSavingsForm() {
  hydrateSavingsForm(defaultSavingsRecord());
}

function loadSavingsRecordToForm(id) {
  const record = state.savingsRecords.find((item) => item.id === id);
  if (!record) {
    return;
  }
  hydrateSavingsForm(record);
  els.savingsForm?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function removeSavingsRecord(id) {
  state.savingsRecords = state.savingsRecords.filter((record) => record.id !== id);
  saveSavingsRecords();
  renderSavingsRegister();
  renderPlaybookLab();
  renderGovernanceCenter();
}

function clearSavingsRecords() {
  state.savingsRecords = [];
  saveSavingsRecords();
  renderSavingsRegister();
  renderPlaybookLab();
  renderGovernanceCenter();
}

function renderSavingsRegister() {
  if (!els.savingsSummary || !els.savingsList) {
    return;
  }

  const summary = savingsSummaryData();
  els.savingsSummary.innerHTML = [
    savingsSummaryTemplate("Records", state.savingsRecords.length, `${summary.acceptedCount} accepted`),
    savingsSummaryTemplate("Accepted savings", summary.acceptedLabel, "Recognized buyer value"),
    savingsSummaryTemplate("Pipeline savings", summary.pipelineLabel, "Target or pending records"),
    savingsSummaryTemplate("Largest saving", summary.largestLabel, summary.largestSupplier || "Add savings records"),
    savingsSummaryTemplate("Open actions", summary.openActions, "Pending or target records")
  ].join("");

  if (els.savingsRegisterStatus) {
    els.savingsRegisterStatus.textContent = state.savingsRecords.length
      ? `${state.savingsRecords.length} saved ${state.savingsRecords.length === 1 ? "record" : "records"} in this browser`
      : "Stored locally in this browser";
  }

  if (!state.savingsRecords.length) {
    els.savingsList.innerHTML = `
      <div class="empty-state quote-empty">
        Save negotiated outcomes here after supplier replies. Use it to show accepted savings, pending targets, rejected asks, and buyer evidence.
      </div>
    `;
    renderValueProofPack();
    return;
  }

  els.savingsList.innerHTML = state.savingsRecords.map(savingsCardTemplate).join("");
  renderValueProofPack();
}

function savingsSummaryData() {
  const rows = state.savingsRecords.map((record) => ({ record, metrics: savingsMetrics(record) }));
  const acceptedRows = rows.filter(({ record }) => ["Accepted", "Partially accepted"].includes(record.status));
  const pipelineRows = rows.filter(({ record }) => ["Target set", "Supplier pending"].includes(record.status));
  const acceptedTotals = sumSavingsByCurrency(acceptedRows);
  const pipelineTotals = sumSavingsByCurrency(pipelineRows);
  const largest = rows.filter(({ metrics }) => metrics.savings > 0).sort((a, b) => b.metrics.savings - a.metrics.savings)[0];
  return {
    acceptedCount: acceptedRows.length,
    acceptedLabel: formatCurrencyTotals(acceptedTotals),
    pipelineLabel: formatCurrencyTotals(pipelineTotals),
    largestLabel: largest ? formatMoney(largest.metrics.savings, largest.record.currency) : "TBC",
    largestSupplier: largest ? `${largest.record.supplier} - ${largest.record.brand} ${largest.record.sku}` : "",
    openActions: pipelineRows.length
  };
}

function sumSavingsByCurrency(rows) {
  return rows.reduce((totals, { record, metrics }) => {
    if (!metrics.savings) {
      return totals;
    }
    totals[record.currency] = (totals[record.currency] || 0) + metrics.savings;
    return totals;
  }, {});
}

function formatCurrencyTotals(totals) {
  const entries = Object.entries(totals);
  return entries.length ? entries.map(([currency, value]) => `${currency} ${formatAmount(value)}`).join(" | ") : "TBC";
}

function savingsMetrics(record) {
  const baselineUnit = parseCostNumber(record.baselineUnit);
  const finalUnit = parseCostNumber(record.finalUnit);
  const quantity = parseCostNumber(record.quantity || "1");
  const hasBaseline = String(record.baselineUnit || "").trim() !== "" && baselineUnit > 0;
  const hasFinal = String(record.finalUnit || "").trim() !== "" && finalUnit > 0;
  const hasQuantity = String(record.quantity || "").trim() !== "" && quantity > 0;
  const hasBaselineTotal = hasBaseline && hasQuantity;
  const hasFinalTotal = hasFinal && hasQuantity;
  const canCalculateSavings = hasBaselineTotal && hasFinalTotal;
  const baselineTotal = hasBaselineTotal ? baselineUnit * quantity : 0;
  const finalTotal = hasFinalTotal ? finalUnit * quantity : 0;
  const savings = canCalculateSavings ? Math.max(0, baselineTotal - finalTotal) : 0;
  const savingsPercent = canCalculateSavings && baselineTotal > 0 ? (savings / baselineTotal) * 100 : 0;
  return { baselineUnit, finalUnit, quantity, baselineTotal, finalTotal, savings, savingsPercent, hasBaseline, hasFinal, hasQuantity, hasBaselineTotal, hasFinalTotal, canCalculateSavings };
}

function savingsMoneyLabel(value, currency, ready) {
  return ready ? formatMoney(value, currency) : "TBC";
}

function savingsSummaryTemplate(label, value, detail) {
  return `
    <article>
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
      <small>${escapeHtml(detail)}</small>
    </article>
  `;
}

function savingsCardTemplate(record) {
  const metrics = savingsMetrics(record);
  const statusClass = record.status.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const cardClass = record.status === "Accepted" || record.status === "Partially accepted"
    ? "accepted"
    : record.status === "Rejected"
      ? "rejected"
      : "pending";
  return `
    <article class="savings-card ${escapeHtml(cardClass)}">
      <div class="savings-card-head">
        <div>
          <span>${escapeHtml(record.category || "Savings record")}</span>
          <h3>${escapeHtml(record.brand)} ${escapeHtml(record.sku)} - ${escapeHtml(record.supplier)}</h3>
          <p>${escapeHtml(record.productName)}</p>
        </div>
        <strong class="savings-status ${escapeHtml(statusClass)}">${escapeHtml(record.status)}</strong>
      </div>
      <dl class="savings-facts">
        <div><dt>Baseline</dt><dd>${escapeHtml(savingsMoneyLabel(metrics.baselineTotal, record.currency, metrics.hasBaselineTotal))}</dd></div>
        <div><dt>Final / target</dt><dd>${escapeHtml(savingsMoneyLabel(metrics.finalTotal, record.currency, metrics.hasFinalTotal))}</dd></div>
        <div><dt>Savings</dt><dd>${escapeHtml(savingsMoneyLabel(metrics.savings, record.currency, metrics.canCalculateSavings))}</dd></div>
        <div><dt>Reduction</dt><dd>${escapeHtml(metrics.canCalculateSavings ? formatCostPercent(metrics.savingsPercent) : "TBC")}</dd></div>
        <div><dt>Quantity</dt><dd>${escapeHtml(record.quantity || "TBC")}</dd></div>
      </dl>
      <p>${escapeHtml(record.notes || "No savings notes added.")}</p>
      <div class="savings-card-actions">
        <button type="button" data-load-savings="${escapeHtml(record.id)}">Load</button>
        <button type="button" data-copy-savings="${escapeHtml(record.id)}">Copy note</button>
        <button type="button" data-remove-savings="${escapeHtml(record.id)}">Remove</button>
      </div>
    </article>
  `;
}

function savingsRecordText(record) {
  const metrics = savingsMetrics(record);
  return `InduScout savings record

Project: ${record.projectName || projectValue("name", "TBC")}
Buyer/company: ${record.buyer || projectValue("buyer", "TBC")}
Owner: ${record.owner || "TBC"}
Decision date: ${record.decisionDate || "TBC"}

Product: ${record.brand} ${record.sku} - ${record.productName}
Supplier: ${record.supplier}
Status: ${record.status}
Evidence: ${record.evidenceUrl || "TBC"}

Baseline unit price: ${savingsMoneyLabel(metrics.baselineUnit, record.currency, metrics.hasBaseline)}
Final / target unit price: ${savingsMoneyLabel(metrics.finalUnit, record.currency, metrics.hasFinal)}
Quantity: ${record.quantity || "TBC"}
Baseline total: ${savingsMoneyLabel(metrics.baselineTotal, record.currency, metrics.hasBaselineTotal)}
Final / target total: ${savingsMoneyLabel(metrics.finalTotal, record.currency, metrics.hasFinalTotal)}
Savings: ${savingsMoneyLabel(metrics.savings, record.currency, metrics.canCalculateSavings)}
Reduction: ${metrics.canCalculateSavings ? formatCostPercent(metrics.savingsPercent) : "TBC"}

Notes:
${record.notes || "None recorded."}`;
}

function savingsRegisterReportText() {
  const summary = savingsSummaryData();
  const rows = state.savingsRecords.length
    ? state.savingsRecords.map((record, index) => `${index + 1}. ${record.supplier} - ${record.brand} ${record.sku} - ${record.status} - ${savingsMetrics(record).savings ? formatMoney(savingsMetrics(record).savings, record.currency) : "Savings TBC"}`).join("\n")
    : "No savings records saved yet.";

  return `InduScout savings register
Prepared on ${formatCopyDate()}

Project: ${projectValue("name", "TBC")}
Buyer/company: ${projectValue("buyer", "TBC")}

Records: ${state.savingsRecords.length}
Accepted records: ${summary.acceptedCount}
Accepted savings: ${summary.acceptedLabel}
Pipeline savings: ${summary.pipelineLabel}
Largest saving: ${summary.largestLabel}
Open actions: ${summary.openActions}

Savings records:
${rows}

Buyer reminder:
Only recognize savings when supplier acceptance, final quote, delivery scope, payment terms, and buyer approval are documented.`;
}

async function copySavingsRegisterReport() {
  const text = savingsRegisterReportText();
  try {
    await navigator.clipboard.writeText(text);
    if (els.copySavingsRegister) {
      els.copySavingsRegister.textContent = "Savings report copied";
      setTimeout(() => {
        els.copySavingsRegister.textContent = "Copy savings report";
      }, 1400);
    }
  } catch {
    window.prompt("Copy savings register", text);
  }
}

async function copySingleSavingsRecord(id, triggerButton) {
  const record = state.savingsRecords.find((item) => item.id === id);
  if (!record) {
    return;
  }
  const text = savingsRecordText(record);
  try {
    await navigator.clipboard.writeText(text);
    if (triggerButton) {
      triggerButton.textContent = "Copied";
      setTimeout(() => {
        triggerButton.textContent = "Copy note";
      }, 1200);
    }
  } catch {
    window.prompt("Copy savings record", text);
  }
}

function savingsExportTable() {
  const headers = [
    "Project Name",
    "Buyer / Company",
    "Buyer Contact",
    "Delivery Country",
    "Target Date",
    "Product",
    "Brand",
    "SKU",
    "Category",
    "Supplier",
    "Status",
    "Currency",
    "Baseline Unit",
    "Final Unit",
    "Quantity",
    "Baseline Total",
    "Final Total",
    "Savings",
    "Savings Percent",
    "Owner",
    "Evidence URL",
    "Decision Date",
    "Notes",
    "Saved At"
  ];
  const rows = state.savingsRecords.map((record) => {
    const metrics = savingsMetrics(record);
    return [
      record.projectName,
      record.buyer,
      record.buyerContact,
      record.deliveryCountry,
      record.targetDate,
      record.productName,
      record.brand,
      record.sku,
      record.category,
      record.supplier,
      record.status,
      record.currency,
      record.baselineUnit,
      record.finalUnit,
      record.quantity,
      metrics.hasBaselineTotal ? formatAmount(metrics.baselineTotal) : "",
      metrics.hasFinalTotal ? formatAmount(metrics.finalTotal) : "",
      metrics.canCalculateSavings ? formatAmount(metrics.savings) : "",
      metrics.canCalculateSavings ? formatCostPercent(metrics.savingsPercent) : "",
      record.owner,
      record.evidenceUrl,
      record.decisionDate,
      record.notes,
      record.savedAt
    ];
  });
  return { headers, rows };
}

function exportSavingsCsv() {
  const table = savingsExportTable();
  if (!table.rows.length) {
    els.exportSavingsCsv.textContent = "Add savings first";
    setTimeout(() => {
      els.exportSavingsCsv.textContent = "Export CSV";
    }, 1200);
    return;
  }
  const csv = [table.headers, ...table.rows].map((row) => row.map(csvEscape).join(",")).join("\r\n");
  const projectSlug = safeFilenamePart(projectValue("name", ""));
  downloadFile(
    projectSlug
      ? `InduScout-Savings-Register-${projectSlug}-${new Date().toISOString().slice(0, 10)}.csv`
      : `InduScout-Savings-Register-${new Date().toISOString().slice(0, 10)}.csv`,
    `\ufeff${csv}`,
    "text/csv;charset=utf-8"
  );
}

function exportSavingsJson() {
  const summary = savingsSummaryData();
  downloadFile(
    `InduScout-Savings-Register-${new Date().toISOString().slice(0, 10)}.json`,
    JSON.stringify({ ...createSessionSnapshot(), savingsRegister: { generatedAt: new Date().toISOString(), summary, records: state.savingsRecords, generatedText: savingsRegisterReportText() } }, null, 2),
    "application/json;charset=utf-8"
  );
}

function populateLearningProducts() {
  if (!els.learningProduct) {
    return;
  }

  const currentValue = els.learningProduct.value;
  els.learningProduct.innerHTML = "";
  products.forEach((product) => {
    const option = document.createElement("option");
    option.value = product.id;
    option.textContent = `${product.brand} ${product.sku} - ${product.name}`;
    els.learningProduct.append(option);
  });

  if ([...els.learningProduct.options].some((option) => option.value === currentValue)) {
    els.learningProduct.value = currentValue;
  }
}

function selectedLearningProduct() {
  return products.find((product) => product.id === els.learningProduct?.value) || products[0];
}

function learningFieldValue(element, fallback = "") {
  const value = String(element?.value || "").trim();
  return value || fallback;
}

function defaultLearningRecord() {
  const product = products[0];
  return {
    id: "",
    productId: product?.id || "",
    supplier: product?.sources?.[0]?.name || "",
    outcome: "Pending review",
    cycleTime: "",
    savingsValue: "",
    confidence: "Useful signal",
    pattern: "Authorized path",
    lesson: "",
    recommendation: ""
  };
}

function hydrateLearningForm(record = {}) {
  if (!els.learningForm) {
    return;
  }

  const data = { ...defaultLearningRecord(), ...record };
  const productId = data.productId && products.some((product) => product.id === data.productId) ? data.productId : products[0]?.id || "";
  populateLearningProducts();
  els.learningId.value = data.id || "";
  els.learningProduct.value = productId;
  els.learningSupplier.value = data.supplier || selectedLearningProduct()?.sources?.[0]?.name || "";
  els.learningOutcome.value = data.outcome || "Pending review";
  els.learningCycleTime.value = data.cycleTime || "";
  els.learningSaving.value = data.savingsValue || "";
  els.learningConfidence.value = data.confidence || "Useful signal";
  els.learningPattern.value = data.pattern || "Authorized path";
  els.learningLesson.value = data.lesson || "";
  els.learningRecommendation.value = data.recommendation || "";
}

function prefillLearningSupplier() {
  const product = selectedLearningProduct();
  if (product && !els.learningSupplier.value.trim()) {
    els.learningSupplier.value = product.sources?.[0]?.name || "";
  }
}

function learningFormSnapshot() {
  updateProjectFromFields();
  const product = selectedLearningProduct();
  const existing = state.learningRecords.find((record) => record.id === els.learningId?.value);
  const supplier = learningFieldValue(els.learningSupplier, product?.sources?.[0]?.name || "Supplier TBC");
  return sanitizeLearningRecord({
    id: learningFieldValue(els.learningId, `${Date.now()}-${safeFilenamePart(`${supplier}-${product?.sku || "learning"}`).toLowerCase() || "learning"}`),
    savedAt: existing?.savedAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    projectName: projectValue("name", ""),
    buyer: projectValue("buyer", ""),
    buyerContact: projectValue("contact", ""),
    deliveryCountry: projectValue("country", ""),
    targetDate: projectValue("targetDate", ""),
    productId: product?.id || "",
    brand: product?.brand || "",
    sku: product?.sku || "",
    productName: product?.name || "",
    category: product?.category || "",
    supplier,
    outcome: learningFieldValue(els.learningOutcome, "Pending review"),
    cycleTime: learningFieldValue(els.learningCycleTime, ""),
    savingsValue: learningFieldValue(els.learningSaving, ""),
    confidence: learningFieldValue(els.learningConfidence, "Useful signal"),
    pattern: learningFieldValue(els.learningPattern, "Authorized path"),
    lesson: learningFieldValue(els.learningLesson, ""),
    recommendation: learningFieldValue(els.learningRecommendation, "")
  });
}

function prefillLearningFromDecision() {
  if (!els.learningForm) {
    return;
  }

  const decision = quoteDecisionInsights();
  const best = decision.recommended?.quote || state.quotes[0];
  const savings = state.savingsRecords[0];
  const product = best
    ? products.find((item) => item.id === best.productId) || products.find((item) => item.sku === best.sku)
    : savings
      ? products.find((item) => item.id === savings.productId) || products.find((item) => item.sku === savings.sku)
      : selectedLearningProduct();
  const supplier = best?.supplier || savings?.supplier || product?.sources?.[0]?.name || "";
  const savingsLabel = savings ? `${savings.currency} ${savingsMetrics(savings).canCalculateSavings ? formatAmount(savingsMetrics(savings).savings) : savings.finalUnit || "value TBC"}` : "";
  hydrateLearningForm({
    productId: product?.id || "",
    supplier,
    outcome: best?.status === "Best option" || savings?.status === "Accepted" ? "PO placed" : "Pending review",
    cycleTime: best?.leadTime || product?.lead || "",
    savingsValue: savingsLabel,
    confidence: decision.recommended ? "Useful signal" : "Needs review",
    pattern: best ? "Authorized path" : "Manual lesson",
    lesson: best ? `Current best quote scored ${decision.recommended.score}. Supplier path is ${supplier}.` : "",
    recommendation: best ? `Start future sourcing with ${supplier}, then verify stock, certificates, warranty path, and landed cost before order.` : ""
  });
  renderLearningLoop();
}

function saveLearningRecordFromForm() {
  if (!els.learningForm) {
    return;
  }

  const record = learningFormSnapshot();
  if (!record.lesson && !record.recommendation) {
    els.saveLearningRecord.textContent = "Add lesson first";
    setTimeout(() => {
      els.saveLearningRecord.textContent = "Save learning";
    }, 1200);
    return;
  }

  state.learningRecords = [record, ...state.learningRecords.filter((item) => item.id !== record.id)].slice(0, 160);
  saveLearningRecords();
  hydrateLearningForm(record);
  renderLearningLoop();
  renderPlaybookLab();
  renderGovernanceCenter();
  els.saveLearningRecord.textContent = "Learning saved";
  setTimeout(() => {
    els.saveLearningRecord.textContent = "Save learning";
  }, 1200);
}

function clearLearningForm() {
  hydrateLearningForm(defaultLearningRecord());
}

function loadLearningRecordToForm(id) {
  const record = state.learningRecords.find((item) => item.id === id);
  if (!record) {
    return;
  }
  hydrateLearningForm(record);
  els.learningForm?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function removeLearningRecord(id) {
  state.learningRecords = state.learningRecords.filter((record) => record.id !== id);
  saveLearningRecords();
  renderLearningLoop();
  renderPlaybookLab();
  renderGovernanceCenter();
}

function clearLearningRecords() {
  state.learningRecords = [];
  saveLearningRecords();
  renderLearningLoop();
  renderPlaybookLab();
  renderGovernanceCenter();
}

function renderLearningLoop() {
  if (!els.learningSummary || !els.learningList) {
    return;
  }

  const summary = learningSummaryData();
  els.learningSummary.innerHTML = [
    learningSummaryTemplate("Records", state.learningRecords.length, `${summary.provenCount} proven`),
    learningSummaryTemplate("Win / placed", summary.winRateLabel, `${summary.wonCount} positive outcomes`),
    learningSummaryTemplate("Avg cycle", summary.averageCycleLabel, "From recorded outcomes"),
    learningSummaryTemplate("Captured value", summary.valueLabel, "Savings or value mentions"),
    learningSummaryTemplate("Next signal", summary.topPattern || "Add outcomes", summary.recommendation)
  ].join("");

  if (els.learningRegisterStatus) {
    els.learningRegisterStatus.textContent = state.learningRecords.length
      ? `${state.learningRecords.length} saved ${state.learningRecords.length === 1 ? "lesson" : "lessons"} in this browser`
      : "Stored locally in this browser";
  }

  if (!state.learningRecords.length) {
    els.learningList.innerHTML = `
      <div class="empty-state quote-empty">
        Save supplier outcomes, buyer decisions, and lessons here. This is the first step toward a closed-loop procurement learning system.
      </div>
    `;
    renderValueProofPack();
    return;
  }

  els.learningList.innerHTML = state.learningRecords.map(learningRecordTemplate).join("");
  renderValueProofPack();
}

function learningSummaryData() {
  const records = state.learningRecords;
  const positiveOutcomes = ["RFQ won", "PO placed"];
  const wonCount = records.filter((record) => positiveOutcomes.includes(record.outcome)).length;
  const provenCount = records.filter((record) => record.confidence === "Proven pattern").length;
  const cycleDays = records.map((record) => parseFirstNumber(record.cycleTime)).filter(Number.isFinite);
  const valueMentions = records.filter((record) => String(record.savingsValue || "").trim()).length;
  const patterns = records.reduce((counts, record) => {
    counts[record.pattern] = (counts[record.pattern] || 0) + 1;
    return counts;
  }, {});
  const topPattern = Object.entries(patterns).sort((a, b) => b[1] - a[1])[0]?.[0] || "";
  const averageCycle = cycleDays.length ? cycleDays.reduce((sum, value) => sum + value, 0) / cycleDays.length : 0;
  const winRate = records.length ? Math.round((wonCount / records.length) * 100) : 0;
  return {
    wonCount,
    provenCount,
    winRateLabel: records.length ? `${winRate}%` : "TBC",
    averageCycleLabel: cycleDays.length ? `${formatAmount(averageCycle)} days` : "TBC",
    valueLabel: valueMentions ? `${valueMentions} records` : "TBC",
    topPattern,
    recommendation: learningRecommendationFromPattern(topPattern)
  };
}

function learningRecommendationFromPattern(pattern) {
  const recommendations = {
    "Authorized path": "Start with verified OEM or distributor route",
    "Fastest valid source": "Prioritize suppliers with proven response speed",
    "Best landed cost": "Compare full landed cost before award",
    "Alternate accepted": "Keep reviewed alternates ready for shortages",
    "Certificate gap": "Request certificates earlier in RFQ",
    "Supplier responsiveness": "Favor suppliers with reply discipline",
    "No-stock risk": "Confirm stock before internal approval",
    "Manual lesson": "Review buyer notes before next RFQ"
  };
  return recommendations[pattern] || "Capture outcomes to improve future sourcing";
}

function learningSummaryTemplate(label, value, detail) {
  return `
    <article>
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(String(value))}</strong>
      <small>${escapeHtml(detail)}</small>
    </article>
  `;
}

function learningRecordTemplate(record) {
  const outcomeClass = record.outcome.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return `
    <article class="learning-card">
      <div class="learning-card-head">
        <div>
          <span>${escapeHtml(record.pattern)}</span>
          <h3>${escapeHtml(record.brand)} ${escapeHtml(record.sku)} - ${escapeHtml(record.supplier)}</h3>
          <p>${escapeHtml(record.productName)}</p>
        </div>
        <strong class="learning-status ${escapeHtml(outcomeClass)}">${escapeHtml(record.outcome)}</strong>
      </div>
      <dl class="learning-facts">
        <div><dt>Confidence</dt><dd>${escapeHtml(record.confidence)}</dd></div>
        <div><dt>Cycle</dt><dd>${escapeHtml(record.cycleTime || "TBC")}</dd></div>
        <div><dt>Value</dt><dd>${escapeHtml(record.savingsValue || "TBC")}</dd></div>
        <div><dt>Category</dt><dd>${escapeHtml(record.category || "TBC")}</dd></div>
      </dl>
      <p><strong>Lesson:</strong> ${escapeHtml(record.lesson || "No lesson recorded.")}</p>
      <p><strong>Next recommendation:</strong> ${escapeHtml(record.recommendation || learningRecommendationFromPattern(record.pattern))}</p>
      <div class="learning-card-actions">
        <button type="button" data-load-learning="${escapeHtml(record.id)}">Load</button>
        <button type="button" data-copy-learning="${escapeHtml(record.id)}">Copy lesson</button>
        <button type="button" data-remove-learning="${escapeHtml(record.id)}">Remove</button>
      </div>
    </article>
  `;
}

function learningRecordText(record) {
  return `InduScout closed-loop learning record

Project: ${record.projectName || projectValue("name", "TBC")}
Buyer/company: ${record.buyer || projectValue("buyer", "TBC")}
Product: ${record.brand} ${record.sku} - ${record.productName}
Category: ${record.category}
Supplier: ${record.supplier}
Outcome: ${record.outcome}
Cycle time: ${record.cycleTime || "TBC"}
Savings / value: ${record.savingsValue || "TBC"}
Confidence: ${record.confidence}
Pattern: ${record.pattern}

Lesson learned:
${record.lesson || "None recorded."}

Next recommendation:
${record.recommendation || learningRecommendationFromPattern(record.pattern)}

Learning guardrail:
Treat this as buyer-side memory. Validate current stock, pricing, certificates, compatibility, and supplier legitimacy before a new purchase.`;
}

function learningReportText() {
  const summary = learningSummaryData();
  const rows = state.learningRecords.length
    ? state.learningRecords.map((record, index) => `${index + 1}. ${record.brand} ${record.sku} - ${record.supplier} - ${record.outcome} - ${record.pattern}`).join("\n")
    : "No learning records saved yet.";

  return `InduScout closed-loop learning report
Prepared on ${formatCopyDate()}

Project: ${projectValue("name", "TBC")}
Buyer/company: ${projectValue("buyer", "TBC")}

Records: ${state.learningRecords.length}
Positive outcomes: ${summary.wonCount}
Proven patterns: ${summary.provenCount}
Win / placed rate: ${summary.winRateLabel}
Average cycle time: ${summary.averageCycleLabel}
Top pattern: ${summary.topPattern || "TBC"}
Recommended improvement: ${summary.recommendation}

Learning register:
${rows}

Closed-loop note:
In a future SaaS version, anonymized and permissioned outcome signals can improve recommendations across teams while keeping buyer-sensitive commercial data protected.`;
}

async function copyLearningReport() {
  const text = learningReportText();
  try {
    await navigator.clipboard.writeText(text);
    if (els.copyLearningReport) {
      els.copyLearningReport.textContent = "Learning report copied";
      setTimeout(() => {
        els.copyLearningReport.textContent = "Copy learning report";
      }, 1400);
    }
  } catch {
    window.prompt("Copy learning report", text);
  }
}

async function copySingleLearningRecord(id, triggerButton) {
  const record = state.learningRecords.find((item) => item.id === id);
  if (!record) {
    return;
  }
  const text = learningRecordText(record);
  try {
    await navigator.clipboard.writeText(text);
    if (triggerButton) {
      triggerButton.textContent = "Copied";
      setTimeout(() => {
        triggerButton.textContent = "Copy lesson";
      }, 1200);
    }
  } catch {
    window.prompt("Copy learning record", text);
  }
}

function learningExportTable() {
  const headers = [
    "Project Name",
    "Buyer / Company",
    "Buyer Contact",
    "Delivery Country",
    "Target Date",
    "Product",
    "Brand",
    "SKU",
    "Category",
    "Supplier",
    "Outcome",
    "Cycle Time",
    "Savings / Value",
    "Confidence",
    "Pattern",
    "Lesson",
    "Recommendation",
    "Saved At"
  ];
  const rows = state.learningRecords.map((record) => [
    record.projectName,
    record.buyer,
    record.buyerContact,
    record.deliveryCountry,
    record.targetDate,
    record.productName,
    record.brand,
    record.sku,
    record.category,
    record.supplier,
    record.outcome,
    record.cycleTime,
    record.savingsValue,
    record.confidence,
    record.pattern,
    record.lesson,
    record.recommendation,
    record.savedAt
  ]);
  return { headers, rows };
}

function exportLearningCsv() {
  const table = learningExportTable();
  if (!table.rows.length) {
    els.exportLearningCsv.textContent = "Add learning first";
    setTimeout(() => {
      els.exportLearningCsv.textContent = "Export CSV";
    }, 1200);
    return;
  }
  const csv = [table.headers, ...table.rows].map((row) => row.map(csvEscape).join(",")).join("\r\n");
  const projectSlug = safeFilenamePart(projectValue("name", ""));
  downloadFile(
    projectSlug
      ? `InduScout-Learning-Loop-${projectSlug}-${new Date().toISOString().slice(0, 10)}.csv`
      : `InduScout-Learning-Loop-${new Date().toISOString().slice(0, 10)}.csv`,
    `\ufeff${csv}`,
    "text/csv;charset=utf-8"
  );
}

function exportLearningJson() {
  const summary = learningSummaryData();
  downloadFile(
    `InduScout-Learning-Loop-${new Date().toISOString().slice(0, 10)}.json`,
    JSON.stringify({ ...createSessionSnapshot(), learningLoop: { generatedAt: new Date().toISOString(), summary, records: state.learningRecords, generatedText: learningReportText() } }, null, 2),
    "application/json;charset=utf-8"
  );
}

function playbookControlInputs() {
  return [els.playbookGoal, els.playbookEvidence, els.playbookScope].filter(Boolean);
}

function defaultPlaybookConfig() {
  return {
    goal: "Balanced procurement",
    evidence: "Standard evidence",
    scope: "Local organization only"
  };
}

function hydratePlaybookControls(config = state.playbookConfig) {
  if (!els.playbookForm) {
    return;
  }

  const data = { ...defaultPlaybookConfig(), ...sanitizePlaybookConfig(config || {}) };
  els.playbookGoal.value = data.goal;
  els.playbookEvidence.value = data.evidence;
  els.playbookScope.value = data.scope;
  state.playbookConfig = data;
}

function playbookConfigFromFields() {
  return sanitizePlaybookConfig({
    goal: learningFieldValue(els.playbookGoal, "Balanced procurement"),
    evidence: learningFieldValue(els.playbookEvidence, "Standard evidence"),
    scope: learningFieldValue(els.playbookScope, "Local organization only")
  });
}

function renderPlaybookLab() {
  if (!els.playbookSummary || !els.playbookRecommendations || !els.playbookList) {
    return;
  }

  const config = playbookConfigFromFields();
  state.playbookConfig = config;
  const recommendations = playbookRecommendations(config);
  const summary = playbookSummaryData(recommendations, config);

  els.playbookSummary.innerHTML = [
    playbookSummaryTemplate("Generated rules", recommendations.length, `${summary.highConfidence} high confidence`),
    playbookSummaryTemplate("Saved playbooks", state.playbookRules.length, "Local organization memory"),
    playbookSummaryTemplate("Learning inputs", summary.learningInputs, "Lessons + quotes + savings + signals"),
    playbookSummaryTemplate("Top score", summary.topScoreLabel, summary.topRule || "Add more outcomes"),
    playbookSummaryTemplate("Boundary", config.scope, summary.privacyMode)
  ].join("");

  els.playbookRecommendations.innerHTML = recommendations.length
    ? recommendations.map(playbookRecommendationTemplate).join("")
    : `<div class="empty-state quote-empty">Add learning records, quotes, savings, or supplier replies to generate sourcing playbook rules.</div>`;

  if (els.playbookRegisterStatus) {
    els.playbookRegisterStatus.textContent = state.playbookRules.length
      ? `${state.playbookRules.length} saved ${state.playbookRules.length === 1 ? "rule" : "rules"} in this browser`
      : "Stored locally in this browser";
  }

  els.playbookList.innerHTML = state.playbookRules.length
    ? state.playbookRules.map(savedPlaybookRuleTemplate).join("")
    : `<div class="empty-state quote-empty">Promote generated recommendations into saved organization playbooks here.</div>`;
}

function playbookRecommendations(config = playbookConfigFromFields()) {
  const recommendations = [];
  const learning = learningSignalBundle();
  const decision = quoteDecisionInsights();
  const savings = savingsSummaryData();
  const replies = supplierReplySignalBundle();
  const reinforcement = reinforcementSummaryData();

  if (learning.topPattern) {
    recommendations.push(makePlaybookRecommendation({
      type: "learning",
      title: `Repeat the ${learning.topPattern.toLowerCase()} pattern`,
      scope: learning.topCategory || "Cross-category sourcing",
      trigger: `${learning.recordCount} learning ${learning.recordCount === 1 ? "record" : "records"} with ${learning.positiveCount} positive outcomes`,
      action: learningRecommendationFromPattern(learning.topPattern),
      why: learning.topLesson || "Local buyer memory shows this pattern is becoming useful.",
      guardrail: "Confirm each new case against current stock, certificates, compatibility, warranty path, and supplier legitimacy.",
      evidence: learning.evidence,
      category: learning.topCategory,
      supplier: learning.topSupplier,
      score: 68 + learning.positiveCount * 5 + learning.provenCount * 6
    }, config));
  }

  if (decision.recommended) {
    const quote = decision.recommended.quote;
    recommendations.push(makePlaybookRecommendation({
      type: "supplier",
      title: `Start RFQ with ${quote.supplier} for ${quote.category}`,
      scope: quote.category,
      trigger: `Best current quote score ${decision.recommended.score}`,
      action: `Use ${quote.supplier} as the first outreach path, then compare against at least one alternate source before award.`,
      why: decision.recommended.reason,
      guardrail: "Do not auto-award. Reconfirm quoted price, validity, delivery terms, warranty path, certificate pack, and exact suffix.",
      evidence: [`Quote status: ${quote.status}`, `Lead time: ${quote.leadTime || "TBC"}`, `Payment: ${quote.paymentTerms || "TBC"}`],
      category: quote.category,
      supplier: quote.supplier,
      score: 62 + Math.round(decision.recommended.score / 4)
    }, config));
  }

  if (savings.acceptedCount || savings.openActions) {
    recommendations.push(makePlaybookRecommendation({
      type: "cost",
      title: "Turn negotiation outcomes into a savings rule",
      scope: "Commercial review",
      trigger: `${savings.acceptedCount} accepted savings records, ${savings.openActions} open savings actions`,
      action: "When a quote is received, create a target price and evidence-backed counter-offer before award review.",
      why: `Accepted savings: ${savings.acceptedLabel}. Pipeline savings: ${savings.pipelineLabel}.`,
      guardrail: "Recognize savings only when supplier acceptance, buyer approval, delivery scope, and payment terms are documented.",
      evidence: [`Largest saving: ${savings.largestLabel}`, `Pipeline: ${savings.pipelineLabel}`],
      category: "Savings",
      supplier: savings.largestSupplier || "",
      score: 66 + savings.acceptedCount * 8 + savings.openActions * 2
    }, config));
  }

  if (replies.actionCount) {
    recommendations.push(makePlaybookRecommendation({
      type: "risk",
      title: "Create a supplier response SLA rule",
      scope: "Supplier follow-up",
      trigger: `${replies.actionCount} supplier reply actions need buyer attention`,
      action: "Set a follow-up checkpoint for missing certificates, unclear alternates, revised price, and unanswered validity questions.",
      why: replies.topAction ? `Most common next action: ${replies.topAction}.` : "Supplier replies contain unresolved buyer actions.",
      guardrail: "Do not treat a supplier reply as compliant until certificates, warranty path, lead time, and seller identity are confirmed.",
      evidence: replies.evidence,
      category: "Supplier response",
      supplier: replies.topSupplier,
      score: 64 + replies.actionCount * 4
    }, config));
  }

  if (state.reinforcementSignals.length) {
    recommendations.push(makePlaybookRecommendation({
      type: "reinforcement",
      title: `Apply local feedback weighting to ${reinforcement.topImpact || "sourcing decisions"}`,
      scope: reinforcement.topImpact || "Reinforcement memory",
      trigger: `${state.reinforcementSignals.length} buyer feedback ${state.reinforcementSignals.length === 1 ? "signal" : "signals"} with net score ${reinforcement.netScoreLabel}`,
      action: reinforcement.netScore >= 0
        ? "Promote recommendations that match positive buyer feedback signals, while keeping verification gates visible."
        : "Down-rank recommendations similar to negative buyer feedback until evidence or supplier behavior improves.",
      why: reinforcement.netTone,
      guardrail: "Use feedback as guidance, not automatic purchasing authority. Keep raw buyer notes local unless a governed opt-in learning policy exists.",
      evidence: [`Positive rate: ${reinforcement.positiveRateLabel}`, `Top impact: ${reinforcement.topImpact || "TBC"}`, `Mode: local beta`],
      category: reinforcement.topImpact || "Feedback",
      supplier: "",
      score: 64 + Math.min(22, Math.abs(Math.round(reinforcement.netScore * 3))) + Math.min(10, state.reinforcementSignals.length)
    }, config));
  }

  if (!recommendations.length) {
    recommendations.push(makePlaybookRecommendation({
      type: "starter",
      title: "Run the first closed-loop sourcing experiment",
      scope: "Pilot workflow",
      trigger: "No local outcomes have been saved yet",
      action: "Shortlist one product, send an RFQ, log one supplier quote, capture the result in Learning, then promote a rule.",
      why: "A closed-loop system needs outcome evidence before it can improve future recommendations.",
      guardrail: "Keep sensitive buyer data local until governance, consent, tenancy, and deletion controls exist.",
      evidence: ["No learning records yet", "No promoted playbook rules yet"],
      category: "Pilot",
      supplier: "",
      score: 58
    }, config));
  }

  return recommendations.sort((a, b) => b.score - a.score).slice(0, 6);
}

function makePlaybookRecommendation(raw, config) {
  const goalBoost = playbookGoalBoost(raw.type, config.goal);
  const evidencePenalty = playbookEvidencePenalty(raw.evidence.length, config.evidence);
  const score = Math.max(1, Math.min(100, Math.round(raw.score + goalBoost - evidencePenalty)));
  const id = safeFilenamePart(`${raw.type}-${raw.title}-${raw.scope}`).toLowerCase() || `${raw.type}-${score}`;
  return {
    id,
    type: raw.type,
    title: raw.title,
    scope: raw.scope,
    trigger: raw.trigger,
    action: raw.action,
    why: raw.why,
    guardrail: raw.guardrail,
    evidence: raw.evidence.slice(0, 6),
    category: raw.category || "",
    supplier: raw.supplier || "",
    score,
    goal: config.goal,
    evidenceMode: config.evidence,
    learningBoundary: config.scope
  };
}

function playbookGoalBoost(type, goal) {
  if (goal === "Fastest reliable source" && ["supplier", "risk", "reinforcement"].includes(type)) {
    return 14;
  }
  if (goal === "Lowest landed cost" && ["cost", "reinforcement"].includes(type)) {
    return 16;
  }
  if (goal === "Risk-controlled award" && ["risk", "learning", "reinforcement"].includes(type)) {
    return 14;
  }
  if (goal === "Stock recovery" && ["supplier", "risk", "reinforcement"].includes(type)) {
    return 10;
  }
  return ["learning", "reinforcement"].includes(type) ? 6 : 0;
}

function playbookEvidencePenalty(evidenceCount, evidenceMode) {
  if (evidenceMode === "Audit-ready only") {
    return evidenceCount >= 4 ? 0 : 12;
  }
  if (evidenceMode === "Strict verification") {
    return evidenceCount >= 3 ? 0 : 7;
  }
  return evidenceCount ? 0 : 3;
}

function learningSignalBundle() {
  const records = state.learningRecords;
  const positiveOutcomes = ["RFQ won", "PO placed"];
  const patternCounts = records.reduce((counts, record) => {
    counts[record.pattern] = (counts[record.pattern] || 0) + 1;
    return counts;
  }, {});
  const categoryCounts = records.reduce((counts, record) => {
    if (record.category) {
      counts[record.category] = (counts[record.category] || 0) + 1;
    }
    return counts;
  }, {});
  const supplierCounts = records.reduce((counts, record) => {
    if (record.supplier) {
      counts[record.supplier] = (counts[record.supplier] || 0) + 1;
    }
    return counts;
  }, {});
  const topPattern = topEntry(patternCounts);
  const topCategory = topEntry(categoryCounts);
  const topSupplier = topEntry(supplierCounts);
  const provenCount = records.filter((record) => record.confidence === "Proven pattern").length;
  const positiveCount = records.filter((record) => positiveOutcomes.includes(record.outcome)).length;
  const topLesson = records.find((record) => record.pattern === topPattern && record.lesson)?.lesson || "";
  const evidence = [
    topPattern ? `Top pattern: ${topPattern}` : "",
    topCategory ? `Top category: ${topCategory}` : "",
    topSupplier ? `Top supplier: ${topSupplier}` : "",
    provenCount ? `${provenCount} proven patterns` : "",
    positiveCount ? `${positiveCount} positive outcomes` : ""
  ].filter(Boolean);
  return { recordCount: records.length, topPattern, topCategory, topSupplier, provenCount, positiveCount, topLesson, evidence };
}

function supplierReplySignalBundle() {
  const replies = state.supplierReplies.filter(replyNeedsAction);
  const actionCounts = replies.reduce((counts, reply) => {
    counts[reply.nextAction] = (counts[reply.nextAction] || 0) + 1;
    return counts;
  }, {});
  const supplierCounts = replies.reduce((counts, reply) => {
    if (reply.supplier) {
      counts[reply.supplier] = (counts[reply.supplier] || 0) + 1;
    }
    return counts;
  }, {});
  const topAction = topEntry(actionCounts);
  const topSupplier = topEntry(supplierCounts);
  const evidence = [
    topAction ? `Top action: ${topAction}` : "",
    topSupplier ? `Top supplier: ${topSupplier}` : "",
    replies.length ? `${replies.length} unresolved supplier replies` : ""
  ].filter(Boolean);
  return { actionCount: replies.length, topAction, topSupplier, evidence };
}

function topEntry(counts) {
  return Object.entries(counts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0]?.[0] || "";
}

function playbookSummaryData(recommendations, config = playbookConfigFromFields()) {
  const learningInputs = state.learningRecords.length + state.quotes.length + state.savingsRecords.length + state.supplierReplies.length + state.reinforcementSignals.length;
  const top = recommendations[0];
  return {
    highConfidence: recommendations.filter((item) => item.score >= 80).length,
    learningInputs,
    topScoreLabel: top ? `${top.score}/100` : "TBC",
    topRule: top?.title || "",
    privacyMode: config.scope === "Future anonymized network-ready"
      ? "Requires consent + anonymization"
      : "No backend sharing"
  };
}

function playbookSummaryTemplate(label, value, detail) {
  return `
    <article>
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(String(value))}</strong>
      <small>${escapeHtml(detail)}</small>
    </article>
  `;
}

function playbookRecommendationTemplate(recommendation) {
  return `
    <article class="playbook-card ${escapeHtml(recommendation.type)}">
      <div class="playbook-card-head">
        <div>
          <span>${escapeHtml(recommendation.type)} rule</span>
          <h3>${escapeHtml(recommendation.title)}</h3>
          <p>${escapeHtml(recommendation.scope)}</p>
        </div>
        <strong>${escapeHtml(String(recommendation.score))}</strong>
      </div>
      <dl class="playbook-facts">
        <div><dt>Goal</dt><dd>${escapeHtml(recommendation.goal)}</dd></div>
        <div><dt>Evidence</dt><dd>${escapeHtml(recommendation.evidenceMode)}</dd></div>
        <div><dt>Boundary</dt><dd>${escapeHtml(recommendation.learningBoundary)}</dd></div>
      </dl>
      <p><strong>Trigger:</strong> ${escapeHtml(recommendation.trigger)}</p>
      <p><strong>Action:</strong> ${escapeHtml(recommendation.action)}</p>
      <p><strong>Why:</strong> ${escapeHtml(recommendation.why)}</p>
      <ul>${recommendation.evidence.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      <p><strong>Guardrail:</strong> ${escapeHtml(recommendation.guardrail)}</p>
      <div class="playbook-card-actions">
        <button type="button" data-promote-playbook="${escapeHtml(recommendation.id)}">Promote rule</button>
        <button type="button" data-copy-playbook-rec="${escapeHtml(recommendation.id)}">Copy</button>
      </div>
    </article>
  `;
}

function savedPlaybookRuleTemplate(rule) {
  return `
    <article class="playbook-card saved">
      <div class="playbook-card-head">
        <div>
          <span>${escapeHtml(rule.type)} playbook</span>
          <h3>${escapeHtml(rule.title)}</h3>
          <p>${escapeHtml(rule.scope)}</p>
        </div>
        <strong>${escapeHtml(String(rule.score))}</strong>
      </div>
      <p><strong>Rule:</strong> ${escapeHtml(rule.action)}</p>
      <p><strong>Guardrail:</strong> ${escapeHtml(rule.guardrail)}</p>
      <div class="playbook-card-actions">
        <button type="button" data-copy-playbook-rule="${escapeHtml(rule.id)}">Copy rule</button>
        <button type="button" data-remove-playbook-rule="${escapeHtml(rule.id)}">Remove</button>
      </div>
    </article>
  `;
}

function promotePlaybookRule(recommendationId = "", triggerButton = els.promotePlaybookRule) {
  const recommendations = playbookRecommendations();
  const recommendation = recommendations.find((item) => item.id === recommendationId) || recommendations[0];
  if (!recommendation) {
    return;
  }

  const rule = sanitizePlaybookRule({
    ...recommendation,
    id: `${Date.now()}-${safeFilenamePart(recommendation.title).toLowerCase() || "playbook-rule"}`,
    savedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sourceRecommendationId: recommendation.id
  });
  state.playbookRules = [rule, ...state.playbookRules.filter((item) => item.sourceRecommendationId !== recommendation.id)].slice(0, 120);
  savePlaybookRules();
  renderPlaybookLab();
  renderLearningQueue();
  if (triggerButton) {
    const original = triggerButton.textContent;
    triggerButton.textContent = "Rule promoted";
    setTimeout(() => {
      triggerButton.textContent = original || "Promote rule";
    }, 1200);
  }
}

function removePlaybookRule(id) {
  state.playbookRules = state.playbookRules.filter((rule) => rule.id !== id);
  savePlaybookRules();
  renderPlaybookLab();
  renderLearningQueue();
}

function clearPlaybookRules() {
  state.playbookRules = [];
  savePlaybookRules();
  renderPlaybookLab();
  renderLearningQueue();
}

function playbookRecommendationText(recommendation) {
  return `InduScout AI playbook recommendation

Title: ${recommendation.title}
Score: ${recommendation.score}/100
Scope: ${recommendation.scope}
Goal: ${recommendation.goal}
Evidence mode: ${recommendation.evidenceMode}
Learning boundary: ${recommendation.learningBoundary}

Trigger:
${recommendation.trigger}

Recommended rule:
${recommendation.action}

Why:
${recommendation.why}

Evidence:
${recommendation.evidence.length ? recommendation.evidence.map((item) => `- ${item}`).join("\n") : "- Evidence TBC"}

Guardrail:
${recommendation.guardrail}`;
}

function playbookBriefText() {
  const config = playbookConfigFromFields();
  const recommendations = playbookRecommendations(config);
  const summary = playbookSummaryData(recommendations, config);
  const rows = recommendations.length
    ? recommendations.map((item, index) => `${index + 1}. ${item.title} - ${item.score}/100 - ${item.action}`).join("\n")
    : "No generated recommendations yet.";
  const saved = state.playbookRules.length
    ? state.playbookRules.map((item, index) => `${index + 1}. ${item.title} - ${item.score}/100`).join("\n")
    : "No saved playbook rules yet.";

  return `InduScout AI Playbook Lab
Prepared on ${formatCopyDate()}

Project: ${projectValue("name", "TBC")}
Buyer/company: ${projectValue("buyer", "TBC")}
Goal: ${config.goal}
Evidence strictness: ${config.evidence}
Learning boundary: ${config.scope}

Generated rules: ${recommendations.length}
High-confidence rules: ${summary.highConfidence}
Learning inputs used: ${summary.learningInputs}
Top score: ${summary.topScoreLabel}

Generated recommendations:
${rows}

Saved organization playbooks:
${saved}

Governance note:
This beta uses local browser data only. Cross-organization learning should be opt-in, tenant-isolated, aggregated or anonymized, and stripped of raw buyer notes, exact commercial terms, personal contact data, and confidential supplier evidence unless the customer explicitly permits that use.`;
}

async function copyPlaybookBrief() {
  const text = playbookBriefText();
  try {
    await navigator.clipboard.writeText(text);
    if (els.copyPlaybookBrief) {
      els.copyPlaybookBrief.textContent = "Playbook copied";
      setTimeout(() => {
        els.copyPlaybookBrief.textContent = "Copy playbook brief";
      }, 1400);
    }
  } catch {
    window.prompt("Copy playbook brief", text);
  }
}

async function copyPlaybookRecommendation(id, triggerButton) {
  const recommendation = playbookRecommendations().find((item) => item.id === id);
  if (!recommendation) {
    return;
  }
  try {
    await navigator.clipboard.writeText(playbookRecommendationText(recommendation));
    if (triggerButton) {
      triggerButton.textContent = "Copied";
      setTimeout(() => {
        triggerButton.textContent = "Copy";
      }, 1200);
    }
  } catch {
    window.prompt("Copy playbook recommendation", playbookRecommendationText(recommendation));
  }
}

async function copySavedPlaybookRule(id, triggerButton) {
  const rule = state.playbookRules.find((item) => item.id === id);
  if (!rule) {
    return;
  }
  try {
    await navigator.clipboard.writeText(playbookRecommendationText(rule));
    if (triggerButton) {
      triggerButton.textContent = "Copied";
      setTimeout(() => {
        triggerButton.textContent = "Copy rule";
      }, 1200);
    }
  } catch {
    window.prompt("Copy playbook rule", playbookRecommendationText(rule));
  }
}

function exportPlaybookJson() {
  const config = playbookConfigFromFields();
  const recommendations = playbookRecommendations(config);
  downloadFile(
    `InduScout-AI-Playbook-Lab-${new Date().toISOString().slice(0, 10)}.json`,
    JSON.stringify({ ...createSessionSnapshot(), playbookLab: { generatedAt: new Date().toISOString(), config, recommendations, savedRules: state.playbookRules, generatedText: playbookBriefText() } }, null, 2),
    "application/json;charset=utf-8"
  );
}

function populateSignalProducts() {
  if (!els.signalProduct) {
    return;
  }

  const currentValue = els.signalProduct.value;
  els.signalProduct.innerHTML = "";
  products.forEach((product) => {
    const option = document.createElement("option");
    option.value = product.id;
    option.textContent = `${product.brand} ${product.sku} - ${product.name}`;
    els.signalProduct.append(option);
  });

  const productId = currentValue && products.some((product) => product.id === currentValue)
    ? currentValue
    : state.shortlist[0] || state.compare[0] || state.quotes[0]?.productId || products[0]?.id || "";
  if (productId) {
    els.signalProduct.value = productId;
  }
}

function selectedSignalProduct() {
  return products.find((product) => product.id === els.signalProduct?.value) || products[0];
}

function signalFieldValue(element, fallback = "") {
  const value = String(element?.value || "").trim();
  return value || fallback;
}

function defaultSignalRecord() {
  const product = products[0];
  return {
    id: "",
    productId: product?.id || "",
    module: "Finder",
    feedback: "Promote recommendation",
    outcome: "Better match",
    impact: "Speed",
    evidence: "Buyer judgement",
    confidence: "Strong buyer signal",
    note: ""
  };
}

function hydrateSignalForm(record = {}) {
  if (!els.signalForm) {
    return;
  }

  const data = { ...defaultSignalRecord(), ...record };
  const productId = data.productId && products.some((product) => product.id === data.productId) ? data.productId : products[0]?.id || "";
  populateSignalProducts();
  els.signalId.value = data.id || "";
  els.signalProduct.value = productId;
  els.signalModule.value = data.module || "Finder";
  els.signalFeedback.value = data.feedback || "Promote recommendation";
  els.signalOutcome.value = data.outcome || "Better match";
  els.signalImpact.value = data.impact || "Speed";
  els.signalEvidence.value = data.evidence || "Buyer judgement";
  els.signalConfidence.value = data.confidence || "Strong buyer signal";
  els.signalNote.value = data.note || "";
}

function hydrateSignalFromSelectedProduct() {
  if (!els.signalNote || els.signalNote.value.trim()) {
    return;
  }
  const product = selectedSignalProduct();
  if (product) {
    els.signalNote.value = `Review buyer feedback for ${product.brand} ${product.sku} in ${product.category}.`;
  }
}

function signalFormSnapshot() {
  updateProjectFromFields();
  const product = selectedSignalProduct();
  const existing = state.reinforcementSignals.find((signal) => signal.id === els.signalId?.value);
  return sanitizeReinforcementSignal({
    id: signalFieldValue(els.signalId, `${Date.now()}-${safeFilenamePart(`${product?.sku || "signal"}-${els.signalImpact?.value || "feedback"}`).toLowerCase() || "signal"}`),
    savedAt: existing?.savedAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    projectName: projectValue("name", ""),
    buyer: projectValue("buyer", ""),
    buyerContact: projectValue("contact", ""),
    deliveryCountry: projectValue("country", ""),
    targetDate: projectValue("targetDate", ""),
    productId: product?.id || "",
    brand: product?.brand || "",
    sku: product?.sku || "",
    productName: product?.name || "",
    category: product?.category || "",
    module: signalFieldValue(els.signalModule, "Finder"),
    feedback: signalFieldValue(els.signalFeedback, "Promote recommendation"),
    outcome: signalFieldValue(els.signalOutcome, "Better match"),
    impact: signalFieldValue(els.signalImpact, "Speed"),
    evidence: signalFieldValue(els.signalEvidence, "Buyer judgement"),
    confidence: signalFieldValue(els.signalConfidence, "Strong buyer signal"),
    note: signalFieldValue(els.signalNote, "")
  });
}

function prefillSignalFromContext() {
  if (!els.signalForm) {
    return;
  }

  const bestQuote = quoteDecisionInsights().recommended?.quote || state.quotes.find((quote) => quote.status === "Best option") || state.quotes[0];
  const savings = state.savingsRecords.find((record) => ["Accepted", "Partially accepted"].includes(record.status)) || state.savingsRecords[0];
  const learning = state.learningRecords.find((record) => record.confidence === "Proven pattern") || state.learningRecords[0];
  const playbook = state.playbookRules[0];
  const productId = bestQuote?.productId || savings?.productId || learning?.productId || state.compare[0] || state.shortlist[0] || selectedSignalProduct()?.id || "";

  hydrateSignalForm({
    productId,
    module: playbook ? "Playbooks" : bestQuote ? "Quotes" : savings ? "Savings" : learning ? "Learning" : "Finder",
    feedback: playbook || bestQuote || savings ? "Promote recommendation" : "Keep neutral",
    outcome: savings?.status === "Accepted" ? "Lower landed cost" : bestQuote ? "Better match" : learning?.outcome === "PO placed" ? "Risk avoided" : "Pending outcome",
    impact: savings ? "Cost" : bestQuote ? "Availability" : learning?.pattern === "Certificate gap" ? "Compliance" : "Risk",
    evidence: savings ? "Savings record" : bestQuote ? "Quote response" : learning ? "Manual review" : "Buyer judgement",
    confidence: savings || bestQuote || learning ? "Observed outcome" : "Needs validation",
    note: playbook
      ? `Promoted playbook rule: ${playbook.title}.`
      : bestQuote
        ? `Best quote signal from ${bestQuote.supplier} for ${bestQuote.brand} ${bestQuote.sku}.`
        : savings
          ? `Savings signal from ${savings.supplier}; status ${savings.status}.`
          : learning
            ? `Learning signal: ${learning.recommendation || learning.lesson}`
            : "Capture buyer feedback from the current sourcing context."
  });
}

function saveSignalRecordFromForm() {
  if (!els.signalForm) {
    return;
  }

  const record = signalFormSnapshot();
  state.reinforcementSignals = [record, ...state.reinforcementSignals.filter((item) => item.id !== record.id)].slice(0, 220);
  saveReinforcementSignals();
  hydrateSignalForm(record);
  renderReinforcementLab();
  renderPlaybookLab();
  renderGovernanceCenter();
  els.saveSignalRecord.textContent = "Signal saved";
  setTimeout(() => {
    els.saveSignalRecord.textContent = "Save signal";
  }, 1200);
}

function clearSignalForm() {
  hydrateSignalForm(defaultSignalRecord());
}

function loadSignalRecordToForm(id) {
  const record = state.reinforcementSignals.find((item) => item.id === id);
  if (!record) {
    return;
  }
  hydrateSignalForm(record);
  els.signalForm?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function removeSignalRecord(id) {
  state.reinforcementSignals = state.reinforcementSignals.filter((record) => record.id !== id);
  saveReinforcementSignals();
  renderReinforcementLab();
  renderPlaybookLab();
  renderGovernanceCenter();
}

function clearSignalRecords() {
  state.reinforcementSignals = [];
  saveReinforcementSignals();
  renderReinforcementLab();
  renderPlaybookLab();
  renderGovernanceCenter();
}

function renderReinforcementLab() {
  if (!els.signalSummary || !els.signalRecommendations || !els.signalList) {
    return;
  }

  const summary = reinforcementSummaryData();
  const recommendations = reinforcementRecommendations();
  els.signalSummary.innerHTML = [
    signalSummaryTemplate("Signals", state.reinforcementSignals.length, `${summary.promoteCount} promote / ${summary.penaltyCount} penalize`),
    signalSummaryTemplate("Net score", summary.netScoreLabel, summary.netTone),
    signalSummaryTemplate("Positive rate", summary.positiveRateLabel, "Buyer feedback balance"),
    signalSummaryTemplate("Top impact", summary.topImpact || "Add signals", summary.topImpactDetail),
    signalSummaryTemplate("Model mode", "Local beta", "No server training")
  ].join("");

  if (els.signalRegisterStatus) {
    els.signalRegisterStatus.textContent = state.reinforcementSignals.length
      ? `${state.reinforcementSignals.length} saved ${state.reinforcementSignals.length === 1 ? "signal" : "signals"} in this browser`
      : "Stored locally in this browser";
  }

  els.signalRecommendations.innerHTML = recommendations.map(signalRecommendationTemplate).join("");
  els.signalList.innerHTML = state.reinforcementSignals.length
    ? state.reinforcementSignals.map(signalRecordTemplate).join("")
    : `<div class="empty-state quote-empty">Save buyer feedback signals here. InduScout will convert them into local scoring guidance for future sourcing decisions.</div>`;
}

function reinforcementSummaryData() {
  const signals = state.reinforcementSignals;
  const scores = signals.map(signalScore);
  const netScore = scores.reduce((sum, value) => sum + value, 0);
  const promoteCount = signals.filter((signal) => signal.feedback === "Promote recommendation").length;
  const penaltyCount = signals.filter((signal) => signal.feedback === "Penalize recommendation").length;
  const positiveCount = scores.filter((score) => score > 0).length;
  const positiveRate = signals.length ? Math.round((positiveCount / signals.length) * 100) : 0;
  const impacts = aggregateSignalScores("impact");
  const topImpactEntry = Object.entries(impacts).sort((a, b) => Math.abs(b[1].score) - Math.abs(a[1].score))[0];
  return {
    promoteCount,
    penaltyCount,
    netScore,
    netScoreLabel: signals.length ? `${netScore > 0 ? "+" : ""}${formatAmount(netScore)}` : "TBC",
    netTone: netScore > 0 ? "Learning is promoting more than penalizing" : netScore < 0 ? "Learning is flagging risk" : "Awaiting balanced feedback",
    positiveRateLabel: signals.length ? `${positiveRate}%` : "TBC",
    topImpact: topImpactEntry?.[0] || "",
    topImpactDetail: topImpactEntry ? `${topImpactEntry[1].count} signals / ${topImpactEntry[1].score > 0 ? "+" : ""}${formatAmount(topImpactEntry[1].score)} score` : "No impact weight yet"
  };
}

function aggregateSignalScores(field) {
  return state.reinforcementSignals.reduce((groups, signal) => {
    const key = cleanText(signal[field] || "Unassigned", 120);
    if (!groups[key]) {
      groups[key] = { score: 0, count: 0, promotes: 0, penalties: 0 };
    }
    const score = signalScore(signal);
    groups[key].score += score;
    groups[key].count += 1;
    groups[key].promotes += signal.feedback === "Promote recommendation" ? 1 : 0;
    groups[key].penalties += signal.feedback === "Penalize recommendation" ? 1 : 0;
    return groups;
  }, {});
}

function signalScore(signal) {
  const feedbackScores = {
    "Promote recommendation": 2,
    "Keep neutral": 0,
    "Penalize recommendation": -2
  };
  const outcomeScores = {
    "Better match": 1,
    "Faster supplier": 1,
    "Lower landed cost": 1,
    "Risk avoided": 1,
    "Supplier failed": -1.5,
    "Wrong product": -2,
    "Missing evidence": -1,
    "Pending outcome": 0
  };
  const confidenceMultiplier = {
    "Observed outcome": 1.35,
    "Strong buyer signal": 1.1,
    "Weak signal": 0.7,
    "Needs validation": 0.45
  };
  const raw = (feedbackScores[signal.feedback] || 0) + (outcomeScores[signal.outcome] || 0);
  return Math.round(raw * (confidenceMultiplier[signal.confidence] || 1) * 10) / 10;
}

function reinforcementRecommendations() {
  const impacts = aggregateSignalScores("impact");
  const modules = aggregateSignalScores("module");
  const outcomes = aggregateSignalScores("outcome");
  const strongestImpact = Object.entries(impacts).sort((a, b) => b[1].score - a[1].score)[0];
  const weakestImpact = Object.entries(impacts).sort((a, b) => a[1].score - b[1].score)[0];
  const strongestModule = Object.entries(modules).sort((a, b) => b[1].score - a[1].score)[0];
  const weakestOutcome = Object.entries(outcomes).sort((a, b) => a[1].score - b[1].score)[0];
  const recommendations = [];

  if (strongestImpact && strongestImpact[1].score > 0) {
    recommendations.push({
      type: "promote",
      title: `Increase ${strongestImpact[0].toLowerCase()} weighting`,
      detail: `${strongestImpact[1].count} local signals suggest ${strongestImpact[0].toLowerCase()} is producing useful procurement outcomes.`,
      action: "Promote matching playbook rules earlier, but keep buyer verification and evidence checks in the workflow.",
      score: strongestImpact[1].score,
      evidence: `${strongestImpact[1].promotes} promotes / ${strongestImpact[1].penalties} penalties`
    });
  }

  if (weakestImpact && weakestImpact[1].score < 0) {
    recommendations.push({
      type: "penalize",
      title: `Reduce confidence for ${weakestImpact[0].toLowerCase()} shortcuts`,
      detail: `${weakestImpact[1].count} local signals are warning that this impact area needs stronger evidence.`,
      action: "Add an extra confirmation step before recommending this route as preferred.",
      score: weakestImpact[1].score,
      evidence: `${weakestImpact[1].promotes} promotes / ${weakestImpact[1].penalties} penalties`
    });
  }

  if (strongestModule && strongestModule[1].count >= 2) {
    recommendations.push({
      type: "module",
      title: `Use ${strongestModule[0]} as a stronger signal source`,
      detail: `${strongestModule[0]} has ${strongestModule[1].count} feedback signals and a net score of ${strongestModule[1].score > 0 ? "+" : ""}${formatAmount(strongestModule[1].score)}.`,
      action: "Let this module contribute more evidence to playbook recommendations after repeat buyer confirmation.",
      score: strongestModule[1].score,
      evidence: "Module-level reinforcement"
    });
  }

  if (weakestOutcome && weakestOutcome[1].score < 0) {
    recommendations.push({
      type: "review",
      title: `Create review gate for ${weakestOutcome[0].toLowerCase()}`,
      detail: `Signals tied to ${weakestOutcome[0].toLowerCase()} are negative in this browser.`,
      action: "Require source evidence, certificate check, alternate review, or supplier escalation before award.",
      score: weakestOutcome[1].score,
      evidence: "Outcome-level risk signal"
    });
  }

  if (!recommendations.length) {
    recommendations.push({
      type: "starter",
      title: "Start with governed feedback capture",
      detail: "Save at least three buyer signals across search, quotes, savings, or supplier replies.",
      action: "Use neutral feedback for uncertain cases and promote or penalize only when there is a clear buyer observation.",
      score: 0,
      evidence: "No reinforcement history yet"
    });
  }

  return recommendations.slice(0, 4);
}

function signalSummaryTemplate(label, value, detail) {
  return `
    <article>
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(String(value))}</strong>
      <small>${escapeHtml(detail)}</small>
    </article>
  `;
}

function signalRecommendationTemplate(item) {
  return `
    <article class="signal-card ${escapeHtml(item.type)}">
      <div class="signal-card-head">
        <div>
          <span>${escapeHtml(item.evidence)}</span>
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.detail)}</p>
        </div>
        <strong>${escapeHtml(item.score > 0 ? `+${formatAmount(item.score)}` : formatAmount(item.score))}</strong>
      </div>
      <p>${escapeHtml(item.action)}</p>
    </article>
  `;
}

function signalRecordTemplate(record) {
  const score = signalScore(record);
  const tone = score > 0 ? "positive" : score < 0 ? "negative" : "neutral";
  return `
    <article class="signal-card saved ${escapeHtml(tone)}">
      <div class="signal-card-head">
        <div>
          <span>${escapeHtml(record.module)} / ${escapeHtml(record.impact)}</span>
          <h3>${escapeHtml(record.brand)} ${escapeHtml(record.sku)} - ${escapeHtml(record.feedback)}</h3>
          <p>${escapeHtml(record.productName)}</p>
        </div>
        <strong>${escapeHtml(score > 0 ? `+${formatAmount(score)}` : formatAmount(score))}</strong>
      </div>
      <dl class="signal-facts">
        <div><dt>Outcome</dt><dd>${escapeHtml(record.outcome)}</dd></div>
        <div><dt>Evidence</dt><dd>${escapeHtml(record.evidence)}</dd></div>
        <div><dt>Confidence</dt><dd>${escapeHtml(record.confidence)}</dd></div>
      </dl>
      <p>${escapeHtml(record.note || "No buyer note added.")}</p>
      <div class="signal-card-actions">
        <button type="button" data-load-signal="${escapeHtml(record.id)}">Load</button>
        <button type="button" data-copy-signal="${escapeHtml(record.id)}">Copy</button>
        <button type="button" data-remove-signal="${escapeHtml(record.id)}">Remove</button>
      </div>
    </article>
  `;
}

function signalRecordText(record) {
  return `InduScout reinforcement signal
Saved: ${new Date(record.savedAt).toLocaleDateString()}

Product: ${record.brand} ${record.sku} - ${record.productName}
Category: ${record.category}
Module: ${record.module}
Buyer feedback: ${record.feedback}
Observed outcome: ${record.outcome}
Primary impact: ${record.impact}
Evidence source: ${record.evidence}
Confidence: ${record.confidence}
Signal score: ${signalScore(record)}

Buyer note:
${record.note || "No buyer note added."}

Governance note:
This is a local feedback signal for improving sourcing recommendations. It should not be used for cross-organization learning unless the customer has approved an aggregated, anonymized, tenant-safe learning policy.`;
}

function signalReportText() {
  const summary = reinforcementSummaryData();
  const recommendations = reinforcementRecommendations().map((item, index) => `${index + 1}. ${item.title} (${item.score > 0 ? "+" : ""}${formatAmount(item.score)}) - ${item.action}`).join("\n");
  const rows = state.reinforcementSignals.length
    ? state.reinforcementSignals.map((record, index) => `${index + 1}. ${record.brand} ${record.sku} - ${record.module} - ${record.feedback} - ${record.outcome} - score ${signalScore(record)}`).join("\n")
    : "No reinforcement signals saved yet.";

  return `InduScout Reinforcement Signals report
Prepared on ${formatCopyDate()}

Project: ${projectValue("name", "TBC")}
Buyer/company: ${projectValue("buyer", "TBC")}

Signals: ${state.reinforcementSignals.length}
Net score: ${summary.netScoreLabel}
Positive rate: ${summary.positiveRateLabel}
Top impact: ${summary.topImpact || "TBC"}

Recommended weight changes:
${recommendations}

Saved signals:
${rows}

Governance note:
This beta keeps reinforcement memory inside the browser. Future SaaS learning should be opt-in, tenant-isolated, auditable, and aggregated or anonymized before any cross-organization benefit is created.`;
}

async function copySignalReport() {
  const text = signalReportText();
  try {
    await navigator.clipboard.writeText(text);
    if (els.copySignalReport) {
      els.copySignalReport.textContent = "Signal report copied";
      setTimeout(() => {
        els.copySignalReport.textContent = "Copy signal report";
      }, 1400);
    }
  } catch {
    window.prompt("Copy signal report", text);
  }
}

async function copySingleSignalRecord(id, triggerButton) {
  const record = state.reinforcementSignals.find((item) => item.id === id);
  if (!record) {
    return;
  }
  try {
    await navigator.clipboard.writeText(signalRecordText(record));
    if (triggerButton) {
      triggerButton.textContent = "Copied";
      setTimeout(() => {
        triggerButton.textContent = "Copy";
      }, 1200);
    }
  } catch {
    window.prompt("Copy reinforcement signal", signalRecordText(record));
  }
}

function signalExportTable() {
  return {
    headers: ["Brand", "SKU", "Product", "Category", "Module", "Feedback", "Outcome", "Impact", "Evidence", "Confidence", "Score", "Project", "Buyer note"],
    rows: state.reinforcementSignals.map((record) => [
      record.brand,
      record.sku,
      record.productName,
      record.category,
      record.module,
      record.feedback,
      record.outcome,
      record.impact,
      record.evidence,
      record.confidence,
      signalScore(record),
      record.projectName,
      record.note
    ])
  };
}

function exportSignalCsv() {
  const table = signalExportTable();
  if (!table.rows.length) {
    els.exportSignalCsv.textContent = "Add signals first";
    setTimeout(() => {
      els.exportSignalCsv.textContent = "Export CSV";
    }, 1200);
    return;
  }
  const csv = [table.headers, ...table.rows].map((row) => row.map(csvEscape).join(",")).join("\r\n");
  downloadFile(`InduScout-Reinforcement-Signals-${new Date().toISOString().slice(0, 10)}.csv`, `\ufeff${csv}`, "text/csv;charset=utf-8");
}

function exportSignalJson() {
  downloadFile(
    `InduScout-Reinforcement-Signals-${new Date().toISOString().slice(0, 10)}.json`,
    JSON.stringify({ ...createSessionSnapshot(), reinforcementLab: { generatedAt: new Date().toISOString(), summary: reinforcementSummaryData(), recommendations: reinforcementRecommendations(), signals: state.reinforcementSignals, generatedText: signalReportText() } }, null, 2),
    "application/json;charset=utf-8"
  );
}

function governanceControlInputs() {
  return [els.governanceBoundary, els.governanceEvidence, els.governanceCommercial, els.governancePersonal].filter(Boolean);
}

function hydrateGovernanceControls(policy = state.governancePolicy) {
  if (!els.governanceForm) {
    return;
  }
  const sanitized = sanitizeGovernancePolicy(policy || {});
  els.governanceBoundary.value = sanitized.boundary;
  els.governanceEvidence.value = sanitized.evidence;
  els.governanceCommercial.value = sanitized.commercial;
  els.governancePersonal.value = sanitized.personal;
}

function governancePolicyFromFields() {
  return sanitizeGovernancePolicy({
    boundary: els.governanceBoundary?.value,
    evidence: els.governanceEvidence?.value,
    commercial: els.governanceCommercial?.value,
    personal: els.governancePersonal?.value
  });
}

function governanceSignalCounts() {
  return {
    outcomes: state.learningRecords.length,
    reinforcement: state.reinforcementSignals.length,
    quotes: state.quotes.length,
    supplierReplies: state.supplierReplies.length,
    savings: state.savingsRecords.length,
    sourceLeads: state.sourceLeads.length,
    productRequests: state.productRequests.length,
    productNotes: Object.values(state.notes).filter((note) => String(note).trim()).length
  };
}

function governanceReadinessScore(counts, policy = state.governancePolicy) {
  const boundaryPoints = {
    "Local browser only": 6,
    "Tenant-only learning": 13,
    "Opt-in anonymized network": 18
  };
  const evidencePoints = {
    "Buyer reviewed": 6,
    "Verified source + outcome": 12,
    "Audit-ready only": 16
  };
  const commercialPoints = {
    "Never share raw commercial terms": 12,
    "Tenant aggregate only": 10,
    "Anonymized benchmark bands": 14
  };
  const personalPoints = {
    "Strip contacts and buyer notes": 14,
    "Tenant-only authorized users": 10,
    "Block from learning datasets": 16
  };
  const signalPoints = Math.min(24, counts.outcomes * 3 + counts.reinforcement * 2 + counts.savings * 2 + counts.supplierReplies + counts.quotes);
  return Math.min(96, 24 + signalPoints + (boundaryPoints[policy.boundary] || 6) + (evidencePoints[policy.evidence] || 6) + (commercialPoints[policy.commercial] || 10) + (personalPoints[policy.personal] || 14));
}

function governanceReadinessLabel(score) {
  if (score >= 84) {
    return "SaaS-ready policy";
  }
  if (score >= 68) {
    return "Strong beta guardrails";
  }
  if (score >= 52) {
    return "Needs evidence depth";
  }
  return "Local-only starter";
}

function governanceNetworkCandidateCount(counts, policy = state.governancePolicy) {
  if (policy.boundary !== "Opt-in anonymized network") {
    return 0;
  }
  const rawCandidates = counts.reinforcement + counts.outcomes + counts.savings + counts.supplierReplies;
  const evidenceMultiplier = policy.evidence === "Audit-ready only" ? 0.55 : policy.evidence === "Verified source + outcome" ? 0.75 : 0.45;
  return Math.max(0, Math.round(rawCandidates * evidenceMultiplier));
}

function governanceData() {
  const policy = state.governancePolicy;
  const counts = governanceSignalCounts();
  const readinessScore = governanceReadinessScore(counts, policy);
  const sensitiveCount = counts.productNotes + state.quotes.filter((quote) => quote.notes).length + state.supplierReplies.filter((reply) => reply.message || reply.notes).length + (state.project.contact ? 1 : 0);
  const networkCandidates = governanceNetworkCandidateCount(counts, policy);
  const totalSignals = counts.outcomes + counts.reinforcement + counts.quotes + counts.supplierReplies + counts.savings + counts.sourceLeads + counts.productRequests;
  return {
    policy,
    counts,
    readinessScore,
    guardrailScore: readinessScore,
    readinessLabel: governanceReadinessLabel(readinessScore),
    totalSignals,
    sensitiveCount,
    networkCandidates,
    boundaryLabel: policy.boundary === "Opt-in anonymized network" ? "Opt-in network" : policy.boundary === "Tenant-only learning" ? "Tenant-safe" : "Local only"
  };
}

function governanceMatrixItems(data = governanceData()) {
  const { counts, policy, networkCandidates, sensitiveCount } = data;
  return [
    {
      title: "Catalog metadata",
      scope: policy.boundary === "Local browser only" ? "Local scoring" : "Network-ready",
      className: "safe",
      count: products.length,
      risk: "Low",
      action: "Use product category, public specs, source type, and confidence tags as safe recommendation inputs."
    },
    {
      title: "Verified source signals",
      scope: policy.evidence === "Buyer reviewed" ? "Review first" : "Learning candidate",
      className: policy.evidence === "Buyer reviewed" ? "review" : "safe",
      count: counts.sourceLeads + sourceDirectory.length,
      risk: "Low to medium",
      action: "Prefer OEM, authorized distributor, datasheet, and certificate evidence before increasing confidence."
    },
    {
      title: "Outcome and reinforcement labels",
      scope: networkCandidates ? "Anonymized aggregate" : "Local or tenant only",
      className: networkCandidates ? "safe" : "tenant",
      count: counts.outcomes + counts.reinforcement,
      risk: "Medium",
      action: "Strip buyer notes, project names, contacts, prices, and supplier-specific confidential details."
    },
    {
      title: "Quotes, prices, and payment terms",
      scope: policy.commercial === "Anonymized benchmark bands" ? "Benchmark bands only" : "Raw data blocked",
      className: policy.commercial === "Never share raw commercial terms" ? "blocked" : "review",
      count: counts.quotes,
      risk: "High",
      action: "Never share raw commercial terms across organizations; use tenant analytics or anonymized bands only."
    },
    {
      title: "Buyer notes and contacts",
      scope: policy.personal === "Block from learning datasets" ? "Blocked" : "Tenant controlled",
      className: policy.personal === "Block from learning datasets" ? "blocked" : "tenant",
      count: sensitiveCount,
      risk: "High",
      action: "Keep contact details, private notes, tender context, and internal references out of network learning."
    },
    {
      title: "Supplier performance trail",
      scope: counts.supplierReplies || counts.savings ? "Governed review queue" : "Awaiting data",
      className: counts.supplierReplies || counts.savings ? "review" : "tenant",
      count: counts.supplierReplies + counts.savings,
      risk: "Medium",
      action: "Use supplier outcomes for local scorecards first; require admin review before broader model influence."
    }
  ];
}

function governanceRecommendations(data = governanceData()) {
  const recommendations = [];
  if (data.totalSignals < 6) {
    recommendations.push({
      type: "Signal depth",
      title: "Capture more closed-loop evidence",
      detail: "Save more quote outcomes, learning records, supplier replies, savings records, and reinforcement signals before trusting automated weighting."
    });
  } else {
    recommendations.push({
      type: "Signal depth",
      title: "Start using outcome-weighted recommendations",
      detail: "There is enough local activity to let playbooks and reinforcement signals influence buyer-side ranking, with human review still required."
    });
  }
  if (data.sensitiveCount) {
    recommendations.push({
      type: "Privacy guardrail",
      title: "Keep raw buyer context out of network learning",
      detail: `${data.sensitiveCount} local records may include notes, contacts, or message content. These should stay local or tenant-only unless explicitly scrubbed.`
    });
  }
  if (data.policy.boundary === "Opt-in anonymized network") {
    recommendations.push({
      type: "Network learning",
      title: "Use consent plus anonymization before cross-organization learning",
      detail: `${data.networkCandidates} current signals could become network-learning candidates after aggregation, de-identification, and customer approval.`
    });
  } else {
    recommendations.push({
      type: "Boundary",
      title: "Keep the beta local until SaaS controls exist",
      detail: "This public beta should demonstrate intelligence locally while the production platform adds accounts, permissions, audit logs, deletion, and tenant isolation."
    });
  }
  recommendations.push({
    type: "Next build",
    title: "Prepare admin approval workflow",
    detail: "The next SaaS step is a review queue where an organization admin decides which anonymized signals are allowed to improve shared recommendations."
  });
  return recommendations.slice(0, 4);
}

function renderGovernanceCenter() {
  if (!els.governanceSummary || !els.governanceMatrix || !els.governanceRecommendations) {
    return;
  }
  const data = governanceData();
  els.governanceSummary.innerHTML = [
    governanceSummaryTemplate("Readiness", `${data.readinessScore}%`, data.readinessLabel),
    governanceSummaryTemplate("Learning boundary", data.boundaryLabel, data.policy.evidence),
    governanceSummaryTemplate("Signals mapped", data.totalSignals, `${data.counts.reinforcement} reinforcement / ${data.counts.outcomes} outcomes`),
    governanceSummaryTemplate("Network candidates", data.networkCandidates, data.networkCandidates ? "Only after consent and anonymization" : "Blocked until policy allows it")
  ].join("");
  els.governanceMatrix.innerHTML = governanceMatrixItems(data).map(governanceMatrixTemplate).join("");
  els.governanceRecommendations.innerHTML = governanceRecommendations(data).map(governanceRecommendationTemplate).join("");
  if (els.learningQueueList) {
    renderLearningQueue();
  }
  if (els.aiLoopRecommendations) {
    renderAiLoop();
  }
  if (els.tenantAdminSummary) {
    renderTenantAdmin();
  }
  if (els.integrationSummary) {
    renderIntegrationBlueprint();
  }
  if (els.saasGateSummary) {
    renderSaasGate();
  }
  if (els.pilotPackSummary) {
    renderPilotPack();
  }
  if (els.demoProofSummary) {
    renderDemoProofPack();
  }
  if (els.valueProofSummary) {
    renderValueProofPack();
  }
}

function governanceSummaryTemplate(label, value, detail) {
  return `
    <article>
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(String(value))}</strong>
      <small>${escapeHtml(detail)}</small>
    </article>
  `;
}

function governanceMatrixTemplate(item) {
  return `
    <article class="governance-card ${escapeHtml(item.className)}">
      <span>${escapeHtml(item.scope)}</span>
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.action)}</p>
      <dl>
        <div><dt>Records</dt><dd>${escapeHtml(String(item.count))}</dd></div>
        <div><dt>Risk</dt><dd>${escapeHtml(item.risk)}</dd></div>
      </dl>
    </article>
  `;
}

function governanceRecommendationTemplate(item) {
  return `
    <article class="governance-recommendation">
      <span>${escapeHtml(item.type)}</span>
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.detail)}</p>
    </article>
  `;
}

function governanceBriefText() {
  const data = governanceData();
  const matrix = governanceMatrixItems(data).map((item) => `- ${item.title}: ${item.scope}; risk ${item.risk}; action: ${item.action}`).join("\n");
  const recommendations = governanceRecommendations(data).map((item, index) => `${index + 1}. ${item.title} - ${item.detail}`).join("\n");

  return `InduScout AI governance and learning-loop brief
Prepared on ${formatCopyDate()}

Project: ${projectValue("name", "TBC")}
Buyer/company: ${projectValue("buyer", "TBC")}

Current policy:
- Learning boundary: ${data.policy.boundary}
- Evidence threshold: ${data.policy.evidence}
- Commercial data rule: ${data.policy.commercial}
- Personal data rule: ${data.policy.personal}

Readiness:
- Governance readiness: ${data.readinessScore}% (${data.readinessLabel})
- Total local learning signals mapped: ${data.totalSignals}
- Network-learning candidates: ${data.networkCandidates}
- Sensitive local records to keep protected: ${data.sensitiveCount}

Signal boundary matrix:
${matrix}

Recommended next controls:
${recommendations}

Principle:
InduScout should learn from buyer outcomes, but raw buyer notes, contacts, commercial terms, tender context, and confidential supplier evidence should not be used across organizations. Future network learning must be opt-in, anonymized or aggregated, tenant-isolated, auditable, and reversible by policy.`;
}

async function copyGovernanceBrief() {
  const text = governanceBriefText();
  try {
    await navigator.clipboard.writeText(text);
    if (els.copyGovernanceBrief) {
      els.copyGovernanceBrief.textContent = "Governance brief copied";
      setTimeout(() => {
        els.copyGovernanceBrief.textContent = "Copy governance brief";
      }, 1400);
    }
  } catch {
    window.prompt("Copy governance brief", text);
  }
}

function exportGovernanceJson() {
  const data = governanceData();
  downloadFile(
    `InduScout-AI-Governance-${new Date().toISOString().slice(0, 10)}.json`,
    JSON.stringify({ ...createSessionSnapshot(), governance: { generatedAt: new Date().toISOString(), data, matrix: governanceMatrixItems(data), recommendations: governanceRecommendations(data), generatedText: governanceBriefText() } }, null, 2),
    "application/json;charset=utf-8"
  );
}

function learningQueueCandidates() {
  const candidates = [];
  const addCandidate = (candidate) => {
    if (!candidate || !candidate.id) {
      return;
    }
    const approval = state.learningApprovals[candidate.id] || {};
    candidates.push({
      status: approval.status || "Needs review",
      decidedAt: approval.decidedAt || "",
      decisionNote: approval.decisionNote || "",
      ...candidate
    });
  };

  state.reinforcementSignals.forEach((signal) => {
    const risk = signal.note ? "Medium" : "Low";
    addCandidate({
      id: `signal-${signal.id}`,
      sourceType: "Reinforcement signal",
      title: `${signal.brand} ${signal.sku} - ${signal.feedback}`,
      subject: `${signal.module} / ${signal.impact}`,
      detail: signal.note || `${signal.outcome} from ${signal.evidence}.`,
      evidence: signal.confidence,
      risk,
      suggestedScope: learningCandidateScope(risk),
      recommendedAction: signal.feedback === "Penalize recommendation" ? "Keep as local risk signal until repeat evidence appears." : "Promote into local scoring after buyer review."
    });
  });

  state.learningRecords.forEach((record) => {
    const risk = record.savingsValue ? "Medium" : "Low";
    addCandidate({
      id: `learning-${record.id}`,
      sourceType: "Outcome lesson",
      title: `${record.brand} ${record.sku} - ${record.outcome}`,
      subject: record.pattern,
      detail: record.recommendation || record.lesson || "Buyer learning record.",
      evidence: record.confidence,
      risk,
      suggestedScope: learningCandidateScope(risk),
      recommendedAction: record.confidence === "Proven pattern" ? "Promote into organization playbooks." : "Hold for more evidence before broader influence."
    });
  });

  state.playbookRules.forEach((rule) => {
    const risk = rule.learningBoundary === "Future anonymized network-ready" ? "Medium" : "Low";
    addCandidate({
      id: `playbook-${rule.id}`,
      sourceType: "Playbook rule",
      title: rule.title,
      subject: rule.goal,
      detail: rule.action || rule.guardrail || "Saved sourcing playbook rule.",
      evidence: rule.evidenceMode,
      risk,
      suggestedScope: rule.learningBoundary === "Supplier-specific review" ? "Tenant only" : learningCandidateScope(risk),
      recommendedAction: "Review evidence and promote only when the rule is repeatable across similar buying contexts."
    });
  });

  state.savingsRecords.forEach((record) => {
    addCandidate({
      id: `savings-${record.id}`,
      sourceType: "Savings outcome",
      title: `${record.brand} ${record.sku} - ${record.status}`,
      subject: record.supplier,
      detail: record.notes || `Savings evidence from ${record.supplier}.`,
      evidence: record.evidenceUrl ? "Evidence URL present" : "Buyer-entered savings",
      risk: "High",
      suggestedScope: "Local only",
      recommendedAction: "Use for local value analytics; do not share raw prices, supplier terms, or savings values across organizations."
    });
  });

  state.quotes.forEach((quote) => {
    addCandidate({
      id: `quote-${quote.id}`,
      sourceType: "Quote outcome",
      title: `${quote.brand} ${quote.sku} - ${quote.status}`,
      subject: quote.supplier,
      detail: quote.notes || `Lead time ${quote.leadTime || "TBC"}, MOQ ${quote.moq || "TBC"}.`,
      evidence: quote.sourceUrl ? "Source URL present" : "Buyer-entered quote",
      risk: quote.unitPrice || quote.paymentTerms || quote.deliveryTerms ? "High" : "Medium",
      suggestedScope: quote.unitPrice ? "Tenant aggregate only" : "Tenant only",
      recommendedAction: "Keep raw quote data tenant-only; convert to anonymized range signals only after admin approval."
    });
  });

  state.supplierReplies.forEach((reply) => {
    addCandidate({
      id: `reply-${reply.id}`,
      sourceType: "Supplier reply",
      title: `${reply.supplier} - ${reply.status}`,
      subject: reply.productLabel || reply.subject || "Supplier message",
      detail: reply.notes || reply.message || "Supplier reply captured in inbox.",
      evidence: reply.nextAction,
      risk: reply.message || reply.notes ? "High" : "Medium",
      suggestedScope: "Local only",
      recommendedAction: "Use for local follow-up and scorecard signals; strip message text before any learning export."
    });
  });

  state.sourceLeads.forEach((lead) => {
    addCandidate({
      id: `source-${lead.id}`,
      sourceType: "Source lead",
      title: lead.name,
      subject: `${lead.type} / ${lead.category}`,
      detail: lead.notes || lead.website || "Supplier/source lead awaiting review.",
      evidence: lead.evidenceUrl ? "Evidence URL present" : lead.status,
      risk: lead.contact || lead.notes ? "Medium" : "Low",
      suggestedScope: learningCandidateScope(lead.contact || lead.notes ? "Medium" : "Low"),
      recommendedAction: "Promote only after source legitimacy, authorization path, and public evidence are verified."
    });
  });

  return candidates.sort((a, b) => learningStatusRank(a.status) - learningStatusRank(b.status) || learningRiskRank(b.risk) - learningRiskRank(a.risk));
}

function learningCandidateScope(risk) {
  if (risk === "High") {
    return "Local only";
  }
  if (risk === "Medium") {
    return state.governancePolicy.boundary === "Opt-in anonymized network" ? "Tenant only" : "Local only";
  }
  return state.governancePolicy.boundary === "Opt-in anonymized network" ? "Anonymized network candidate" : state.governancePolicy.boundary === "Tenant-only learning" ? "Tenant only" : "Local only";
}

function learningStatusRank(status) {
  return {
    "Needs review": 0,
    "Tenant only": 1,
    "Approved": 2,
    "Blocked": 3
  }[status] ?? 4;
}

function learningRiskRank(risk) {
  return {
    High: 3,
    Medium: 2,
    Low: 1
  }[risk] || 0;
}

function learningQueueSummary(candidates = learningQueueCandidates()) {
  const approved = candidates.filter((candidate) => candidate.status === "Approved").length;
  const tenantOnly = candidates.filter((candidate) => candidate.status === "Tenant only").length;
  const blocked = candidates.filter((candidate) => candidate.status === "Blocked").length;
  const highRisk = candidates.filter((candidate) => candidate.risk === "High").length;
  const networkReady = candidates.filter((candidate) => candidate.status === "Approved" && candidate.suggestedScope === "Anonymized network candidate").length;
  return {
    total: candidates.length,
    needsReview: candidates.length - approved - tenantOnly - blocked,
    approved,
    tenantOnly,
    blocked,
    highRisk,
    networkReady
  };
}

function filteredLearningQueueCandidates() {
  const statusFilter = els.learningQueueFilter?.value || "all";
  const riskFilter = els.learningQueueRisk?.value || "all";
  return learningQueueCandidates().filter((candidate) => {
    const statusSlug = learningStatusSlug(candidate.status);
    const riskSlug = candidate.risk.toLowerCase();
    return (statusFilter === "all" || statusFilter === statusSlug) && (riskFilter === "all" || riskFilter === riskSlug);
  });
}

function learningStatusSlug(status) {
  return String(status || "Needs review").toLowerCase().replace(/\s+/g, "-");
}

function renderLearningQueue() {
  if (!els.learningQueueSummary || !els.learningQueueList) {
    return;
  }

  const allCandidates = learningQueueCandidates();
  const summary = learningQueueSummary(allCandidates);
  const visibleCandidates = filteredLearningQueueCandidates();
  els.learningQueueSummary.innerHTML = [
    learningQueueSummaryTemplate("Candidates", summary.total, `${summary.needsReview} need review`),
    learningQueueSummaryTemplate("Approved", summary.approved, `${summary.networkReady} network-ready`),
    learningQueueSummaryTemplate("Tenant only", summary.tenantOnly, "Organization learning"),
    learningQueueSummaryTemplate("Blocked", summary.blocked, "Excluded from learning"),
    learningQueueSummaryTemplate("High risk", summary.highRisk, "Commercial or message context")
  ].join("");

  if (els.learningQueueStatus) {
    els.learningQueueStatus.textContent = summary.total
      ? `${visibleCandidates.length} shown from ${summary.total} candidates. Approvals stay local until a governed SaaS backend exists.`
      : "No learning candidates yet. Save signals, lessons, quotes, savings, replies, or source leads.";
  }

  els.learningQueueList.innerHTML = visibleCandidates.length
    ? visibleCandidates.map(learningQueueCandidateTemplate).join("")
    : `<div class="empty-state quote-empty">No candidates match this queue filter. Add sourcing outcomes or change the review filters.</div>`;
}

function learningQueueSummaryTemplate(label, value, detail) {
  return `
    <article>
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(String(value))}</strong>
      <small>${escapeHtml(detail)}</small>
    </article>
  `;
}

function learningQueueCandidateTemplate(candidate) {
  const statusSlug = learningStatusSlug(candidate.status);
  const riskClass = candidate.risk.toLowerCase();
  return `
    <article class="learning-queue-card ${escapeHtml(statusSlug)} ${escapeHtml(riskClass)}">
      <div>
        <span>${escapeHtml(candidate.sourceType)} / ${escapeHtml(candidate.risk)} risk</span>
        <h3>${escapeHtml(candidate.title)}</h3>
        <p>${escapeHtml(candidate.detail)}</p>
        <dl class="learning-queue-facts">
          <div><dt>Subject</dt><dd>${escapeHtml(candidate.subject)}</dd></div>
          <div><dt>Evidence</dt><dd>${escapeHtml(candidate.evidence)}</dd></div>
          <div><dt>Scope</dt><dd>${escapeHtml(candidate.suggestedScope)}</dd></div>
        </dl>
      </div>
      <div class="learning-queue-decision">
        <strong class="learning-queue-status ${escapeHtml(statusSlug)}">${escapeHtml(candidate.status)}</strong>
        <p>${escapeHtml(candidate.recommendedAction)}</p>
        <div class="learning-queue-actions">
          <button type="button" data-learning-queue-action="Approved" data-candidate-id="${escapeHtml(candidate.id)}">Approve</button>
          <button type="button" data-learning-queue-action="Tenant only" data-candidate-id="${escapeHtml(candidate.id)}">Tenant only</button>
          <button type="button" data-learning-queue-action="Blocked" data-candidate-id="${escapeHtml(candidate.id)}">Block</button>
          <button type="button" data-copy-learning-candidate="${escapeHtml(candidate.id)}">Copy candidate</button>
        </div>
      </div>
    </article>
  `;
}

function setLearningCandidateStatus(status, candidateId) {
  const allowed = ["Approved", "Tenant only", "Blocked"];
  if (!allowed.includes(status) || !candidateId) {
    return;
  }
  state.learningApprovals[candidateId] = {
    status,
    decidedAt: new Date().toISOString(),
    decisionNote: status === "Approved" ? "Approved for governed learning influence." : status === "Tenant only" ? "Limited to organization learning boundary." : "Blocked from learning influence."
  };
  saveLearningApprovals();
  renderLearningQueue();
  renderAiLoop();
  renderTenantAdmin();
  renderIntegrationBlueprint();
  renderSaasGate();
  renderPilotPack();
  renderDemoProofPack();
  renderValueProofPack();
}

function approveSafeLearningCandidates() {
  const candidates = learningQueueCandidates();
  candidates
    .filter((candidate) => candidate.risk === "Low" && candidate.status !== "Blocked")
    .forEach((candidate) => {
      state.learningApprovals[candidate.id] = {
        status: "Approved",
        decidedAt: new Date().toISOString(),
        decisionNote: "Bulk-approved low-risk candidate."
      };
    });
  saveLearningApprovals();
  renderLearningQueue();
  renderAiLoop();
  renderTenantAdmin();
  renderIntegrationBlueprint();
  renderSaasGate();
  renderPilotPack();
  renderDemoProofPack();
  renderValueProofPack();
  if (els.approveSafeLearning) {
    els.approveSafeLearning.textContent = "Safe candidates approved";
    setTimeout(() => {
      els.approveSafeLearning.textContent = "Approve safe";
    }, 1400);
  }
}

function learningCandidateText(candidate) {
  return `InduScout learning review candidate
Source type: ${candidate.sourceType}
Title: ${candidate.title}
Subject: ${candidate.subject}
Risk: ${candidate.risk}
Suggested scope: ${candidate.suggestedScope}
Status: ${candidate.status}
Evidence: ${candidate.evidence}

Candidate detail:
${candidate.detail}

Recommended action:
${candidate.recommendedAction}

Governance note:
Raw buyer notes, contact details, quote prices, payment terms, supplier messages, and tender context should stay local or tenant-only unless explicitly scrubbed and approved.`;
}

async function copyLearningCandidate(candidateId, triggerButton) {
  const candidate = learningQueueCandidates().find((item) => item.id === candidateId);
  if (!candidate) {
    return;
  }
  const text = learningCandidateText(candidate);
  try {
    await navigator.clipboard.writeText(text);
    if (triggerButton) {
      triggerButton.textContent = "Copied";
      setTimeout(() => {
        triggerButton.textContent = "Copy candidate";
      }, 1200);
    }
  } catch {
    window.prompt("Copy learning candidate", text);
  }
}

function learningQueueBriefText() {
  const candidates = learningQueueCandidates();
  const summary = learningQueueSummary(candidates);
  const rows = candidates.length
    ? candidates.map((candidate, index) => `${index + 1}. ${candidate.sourceType} - ${candidate.title} - ${candidate.risk} risk - ${candidate.status} - ${candidate.suggestedScope}`).join("\n")
    : "No learning candidates yet.";

  return `InduScout governed learning review queue
Prepared on ${formatCopyDate()}

Project: ${projectValue("name", "TBC")}
Buyer/company: ${projectValue("buyer", "TBC")}
Governance boundary: ${state.governancePolicy.boundary}
Evidence threshold: ${state.governancePolicy.evidence}

Queue summary:
- Candidates: ${summary.total}
- Needs review: ${summary.needsReview}
- Approved: ${summary.approved}
- Tenant only: ${summary.tenantOnly}
- Blocked: ${summary.blocked}
- High risk: ${summary.highRisk}
- Network-ready approved candidates: ${summary.networkReady}

Candidate register:
${rows}

Operating principle:
Learning should become stronger over time, but only after buyer review. Sensitive quote terms, supplier messages, buyer notes, contacts, and tender context should remain local or tenant-only unless explicitly scrubbed, approved, anonymized, and auditable.`;
}

async function copyLearningQueueBrief() {
  const text = learningQueueBriefText();
  try {
    await navigator.clipboard.writeText(text);
    if (els.copyLearningQueue) {
      els.copyLearningQueue.textContent = "Queue brief copied";
      setTimeout(() => {
        els.copyLearningQueue.textContent = "Copy queue brief";
      }, 1400);
    }
  } catch {
    window.prompt("Copy learning queue brief", text);
  }
}

function exportLearningQueueJson() {
  const candidates = learningQueueCandidates();
  downloadFile(
    `InduScout-Learning-Queue-${new Date().toISOString().slice(0, 10)}.json`,
    JSON.stringify({ ...createSessionSnapshot(), learningQueue: { generatedAt: new Date().toISOString(), summary: learningQueueSummary(candidates), candidates, generatedText: learningQueueBriefText() } }, null, 2),
    "application/json;charset=utf-8"
  );
}

function aiLoopEligibleCandidates() {
  return learningQueueCandidates().filter((candidate) => ["Approved", "Tenant only"].includes(candidate.status));
}

function aiLoopStatusLabel(score) {
  if (score >= 80) {
    return "Ready for stronger local guidance";
  }
  if (score >= 62) {
    return "Useful with buyer review";
  }
  if (score >= 42) {
    return "Early signal layer";
  }
  return "Needs more approved evidence";
}

function aiLoopTopCandidateType(candidates) {
  const counts = candidates.reduce((groups, candidate) => {
    const key = candidate.sourceType || "Learning signal";
    groups[key] = (groups[key] || 0) + 1;
    return groups;
  }, {});
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0];
  return top ? { label: top[0], count: top[1] } : { label: "No approved pattern", count: 0 };
}

function aiLoopData() {
  const candidates = learningQueueCandidates();
  const eligible = aiLoopEligibleCandidates();
  const summary = learningQueueSummary(candidates);
  const governance = governanceData();
  const scorecard = supplierScorecardData();
  const decision = quoteDecisionInsights();
  const topType = aiLoopTopCandidateType(eligible);
  const localEvidence = state.quotes.length + state.supplierReplies.length + state.savingsRecords.length + state.learningRecords.length + state.reinforcementSignals.length;
  const influenceScore = Math.max(0, Math.min(100, Math.round(
    18 +
    governance.readinessScore * 0.32 +
    eligible.length * 7 +
    Math.min(16, localEvidence * 2) -
    summary.blocked * 2
  )));
  const networkAllowed = state.governancePolicy.boundary === "Opt-in anonymized network";
  return {
    candidates,
    eligible,
    summary,
    governance,
    scorecard,
    decision,
    topType,
    localEvidence,
    influenceScore,
    readiness: influenceScore,
    statusLabel: aiLoopStatusLabel(influenceScore),
    networkAllowed,
    gatedSignals: summary.needsReview + summary.blocked,
    topSupplier: scorecard.top?.name || "TBC",
    topSupplierScore: scorecard.top?.score || 0
  };
}

function aiLoopRecommendationCards(data = aiLoopData()) {
  const cards = [];
  const boost = Math.min(24, data.eligible.length * 4 + Math.round(data.governance.readinessScore / 12));

  if (data.eligible.length) {
    cards.push({
      className: "boost",
      title: "Apply approved learning to local recommendation weight",
      score: `+${boost}`,
      boundary: state.governancePolicy.boundary,
      evidence: `${data.eligible.length} approved or tenant-only candidates`,
      detail: `The system can safely use ${data.topType.label.toLowerCase()} as a local buyer-side signal because it passed the review queue.`,
      action: "Promote matching product, source, or supplier paths in local guidance while keeping final buyer verification visible.",
      tags: ["reviewed", "local influence", data.topType.label]
    });
  } else {
    cards.push({
      className: "hold",
      title: "Hold recommendation learning until evidence is approved",
      score: "+0",
      boundary: "Review required",
      evidence: `${data.summary.needsReview} candidates waiting`,
      detail: "The app can still search and prepare RFQs, but closed-loop weighting should wait for approved learning candidates.",
      action: "Approve low-risk learning candidates or save more outcomes, supplier replies, quotes, and reinforcement signals.",
      tags: ["safe default", "human review", "no silent learning"]
    });
  }

  if (data.scorecard.top) {
    cards.push({
      className: data.scorecard.top.score >= 70 ? "boost" : "hold",
      title: `${data.scorecard.top.name} becomes the current supplier benchmark`,
      score: `${data.scorecard.top.score}%`,
      boundary: "Supplier scorecard",
      evidence: `${data.scorecard.top.quotes} quotes / ${data.scorecard.top.replies} replies / ${data.scorecard.top.sourceLeads} leads`,
      detail: data.scorecard.top.statusLabel,
      action: data.scorecard.top.nextAction,
      tags: data.scorecard.top.strengths.slice(0, 3)
    });
  } else {
    cards.push({
      className: "hold",
      title: "Supplier recommendation needs quote or reply evidence",
      score: "TBC",
      boundary: "Local workspace",
      evidence: "No ranked supplier path yet",
      detail: "Supplier scoring becomes more useful when the buyer logs quotes, replies, source leads, or shortlist source paths.",
      action: "Use supplier outreach, quote tracker, inbox, and source intake to generate the first ranked supplier path.",
      tags: ["quotes", "inbox", "source intake"]
    });
  }

  if (data.networkAllowed && data.summary.networkReady) {
    cards.push({
      className: "boost",
      title: "Prepare anonymized network-learning candidates",
      score: `${data.summary.networkReady}`,
      boundary: "Opt-in network candidate",
      evidence: "Approved low-risk signals with network-ready scope",
      detail: "These candidates could later help other organizations after consent, aggregation, anonymization, audit logging, and deletion controls exist.",
      action: "Keep raw commercial terms out; export only scrubbed learning metadata for future SaaS review.",
      tags: ["anonymized", "permissioned", "audit-ready"]
    });
  } else {
    cards.push({
      className: "hold",
      title: "Keep cross-organization learning gated",
      score: `${data.summary.networkReady}`,
      boundary: state.governancePolicy.boundary,
      evidence: `${data.gatedSignals} gated or blocked candidates`,
      detail: "This protects buyer notes, contacts, supplier messages, and raw commercial terms while the product is still a static beta.",
      action: "Use the governance policy simulator and learning queue before any shared-learning or SaaS backend is introduced.",
      tags: ["tenant-safe", "privacy", "governance"]
    });
  }

  if (data.decision.recommended) {
    cards.push({
      className: "boost",
      title: "Use quote decision score as commercial feedback",
      score: `${data.decision.recommended.score}`,
      boundary: "Tenant-only commercial learning",
      evidence: `${data.decision.scoredQuotes.length} quote records scored`,
      detail: `${data.decision.recommended.quote.supplier} currently leads the quote decision desk.`,
      action: "Use the winner as a buyer-side benchmark, but keep raw price, payment, delivery, and validity fields tenant-only.",
      tags: ["quote scoring", "commercial guardrail", "buyer validation"]
    });
  }

  return cards.slice(0, 5);
}

function renderAiLoop() {
  if (!els.aiLoopSummary || !els.aiLoopPipeline || !els.aiLoopRecommendations) {
    return;
  }

  const data = aiLoopData();
  const recommendations = aiLoopRecommendationCards(data);
  els.aiLoopSummary.innerHTML = [
    aiLoopSummaryTemplate("Influence readiness", `${data.influenceScore}%`, data.statusLabel),
    aiLoopSummaryTemplate("Eligible signals", data.eligible.length, `${data.summary.approved} approved / ${data.summary.tenantOnly} tenant-only`),
    aiLoopSummaryTemplate("Gated signals", data.gatedSignals, `${data.summary.needsReview} review / ${data.summary.blocked} blocked`),
    aiLoopSummaryTemplate("Top supplier", data.topSupplier, data.topSupplierScore ? `${data.topSupplierScore}% current score` : "Add quotes or source paths")
  ].join("");

  if (els.aiLoopStatus) {
    els.aiLoopStatus.textContent = data.eligible.length
      ? `${recommendations.length} explainable recommendation updates generated from approved local learning.`
      : "Approve learning candidates before the AI Loop changes recommendation guidance.";
  }

  els.aiLoopPipeline.innerHTML = [
    aiLoopStepTemplate("1", "Capture", data.candidates.length, "Signals from quotes, replies, savings, source leads, playbooks, and feedback."),
    aiLoopStepTemplate("2", "Govern", data.eligible.length, "Only approved or tenant-only candidates can influence the loop."),
    aiLoopStepTemplate("3", "Apply", `${data.influenceScore}%`, "Explainable local weighting, not hidden model training."),
    aiLoopStepTemplate("4", "Improve", recommendations.length, "Buyer-visible recommendations with evidence and guardrails.")
  ].join("");

  els.aiLoopRecommendations.innerHTML = recommendations.map(aiLoopCardTemplate).join("");
}

function aiLoopSummaryTemplate(label, value, detail) {
  return `
    <article>
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(String(value))}</strong>
      <small>${escapeHtml(detail)}</small>
    </article>
  `;
}

function aiLoopStepTemplate(number, title, value, detail) {
  return `
    <article class="ai-loop-step">
      <span>Step ${escapeHtml(number)}</span>
      <strong>${escapeHtml(String(value))}</strong>
      <h3>${escapeHtml(title)}</h3>
      <p>${escapeHtml(detail)}</p>
    </article>
  `;
}

function aiLoopCardTemplate(card) {
  return `
    <article class="ai-loop-card ${escapeHtml(card.className)}">
      <span>${escapeHtml(card.boundary)}</span>
      <h3>${escapeHtml(card.title)}</h3>
      <p>${escapeHtml(card.detail)}</p>
      <dl>
        <div><dt>Adjustment</dt><dd>${escapeHtml(card.score)}</dd></div>
        <div><dt>Evidence</dt><dd>${escapeHtml(card.evidence)}</dd></div>
        <div><dt>Action</dt><dd>${escapeHtml(card.action)}</dd></div>
      </dl>
      <footer>${card.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</footer>
    </article>
  `;
}

function aiLoopBriefText() {
  const data = aiLoopData();
  const recommendations = aiLoopRecommendationCards(data);
  const rows = recommendations.map((card, index) => `${index + 1}. ${card.title}
   Adjustment: ${card.score}
   Boundary: ${card.boundary}
   Evidence: ${card.evidence}
   Action: ${card.action}`).join("\n");

  return `InduScout closed-loop intelligence brief
Prepared on ${formatCopyDate()}

Project: ${projectValue("name", "TBC")}
Buyer/company: ${projectValue("buyer", "TBC")}
Governance boundary: ${state.governancePolicy.boundary}
Evidence threshold: ${state.governancePolicy.evidence}

Loop status:
- Influence readiness: ${data.influenceScore}% (${data.statusLabel})
- Total learning candidates: ${data.candidates.length}
- Eligible signals: ${data.eligible.length}
- Gated or blocked signals: ${data.gatedSignals}
- Network-ready approved candidates: ${data.summary.networkReady}
- Top supplier path: ${data.topSupplier}${data.topSupplierScore ? ` (${data.topSupplierScore}%)` : ""}

Recommendation updates:
${rows || "No recommendation updates yet."}

Operating principle:
Approved learning can improve local recommendations. Tenant-only and commercial signals remain controlled. Cross-organization learning should be opt-in, anonymized, aggregated, auditable, and reversible before any SaaS network layer is launched.`;
}

async function copyAiLoopBrief() {
  const text = aiLoopBriefText();
  try {
    await navigator.clipboard.writeText(text);
    if (els.copyAiLoopBrief) {
      els.copyAiLoopBrief.textContent = "AI loop brief copied";
      setTimeout(() => {
        els.copyAiLoopBrief.textContent = "Copy AI loop brief";
      }, 1400);
    }
  } catch {
    window.prompt("Copy AI loop brief", text);
  }
}

function exportAiLoopJson() {
  const data = aiLoopData();
  const recommendations = aiLoopRecommendationCards(data);
  downloadFile(
    `InduScout-AI-Loop-${new Date().toISOString().slice(0, 10)}.json`,
    JSON.stringify({ ...createSessionSnapshot(), aiLoop: { generatedAt: new Date().toISOString(), data, recommendations, generatedText: aiLoopBriefText() } }, null, 2),
    "application/json;charset=utf-8"
  );
}

function tenantAdminData() {
  const governance = governanceData();
  const aiLoop = aiLoopData();
  const learning = learningQueueSummary();
  const scorecard = supplierScorecardData();
  const reviewItems = evidenceReviewItems();
  const exportableRecords = state.shortlist.length + state.compare.length + state.quotes.length + state.supplierReplies.length + state.sourceLeads.length + state.learningRecords.length + state.savingsRecords.length;
  const adminReadiness = Math.max(0, Math.min(100, Math.round(
    20 +
    governance.readinessScore * 0.25 +
    aiLoop.influenceScore * 0.2 +
    Math.min(18, exportableRecords * 2) +
    Math.min(14, reviewItems.length * 2) +
    (state.project.name || state.project.buyer ? 8 : 0)
  )));
  return {
    governance,
    aiLoop,
    learning,
    scorecard,
    reviewItems,
    exportableRecords,
    adminReadiness,
    adminStatus: tenantAdminStatusLabel(adminReadiness),
    auditEvents: tenantAuditEvents({ governance, aiLoop, learning, scorecard, reviewItems })
  };
}

function tenantAdminStatusLabel(score) {
  if (score >= 82) {
    return "Ready for SaaS design review";
  }
  if (score >= 64) {
    return "Strong admin prototype";
  }
  if (score >= 45) {
    return "Controls need more activity";
  }
  return "Early admin foundation";
}

function tenantRoleCards(data = tenantAdminData()) {
  return [
    {
      className: "admin",
      title: "Organization admin",
      detail: "Owns tenant settings, learning boundary, user access, export policy, and deletion requests.",
      permissions: ["Approve learning scope", "Export audit pack", "Manage buyer roles", "Review sensitive signals"]
    },
    {
      className: "buyer",
      title: "Buyer / sourcing user",
      detail: "Searches products, prepares RFQs, records quotes, evaluates suppliers, and exports buyer files.",
      permissions: ["Create shortlists", "Track quotes", "Copy supplier emails", "Export project files"]
    },
    {
      className: "reviewer",
      title: "Technical reviewer",
      detail: "Checks specs, alternates, certificates, substitution approvals, and supplier evidence before award.",
      permissions: ["Review alternates", "Approve substitutions", "Check certificates", "Flag risks"]
    },
    {
      className: "supplier",
      title: "Supplier contributor",
      detail: "Future restricted role for source submissions, quote replies, evidence uploads, and correction requests.",
      permissions: ["Submit source evidence", "Reply to RFQs", "Update catalog claims", "No buyer notes access"]
    }
  ];
}

function tenantControlCards(data = tenantAdminData()) {
  const exportStatus = data.exportableRecords ? "ready" : "review";
  const learningStatus = data.learning.approved || data.learning.tenantOnly ? "ready" : "review";
  const networkStatus = state.governancePolicy.boundary === "Opt-in anonymized network" && data.learning.networkReady ? "review" : "ready";
  return [
    {
      className: learningStatus,
      title: "Learning approvals",
      detail: `${data.learning.approved} approved, ${data.learning.tenantOnly} tenant-only, ${data.learning.blocked} blocked.`,
      items: ["No silent learning", "Reviewed candidates only", "Blocked signals excluded"]
    },
    {
      className: exportStatus,
      title: "Export governance",
      detail: `${data.exportableRecords} local records can appear in buyer-controlled exports.`,
      items: ["Sanitized filenames", "Formula-injection guard", "User downloads only"]
    },
    {
      className: networkStatus,
      title: "Network learning gate",
      detail: `${data.learning.networkReady} approved candidates are network-ready under current policy.`,
      items: ["Consent required", "Anonymize first", "Audit and deletion controls"]
    }
  ];
}

function tenantAuditEvents(data) {
  const events = [];
  const addEvent = (event) => {
    if (event && event.title) {
      events.push({
        actor: event.actor || "InduScout local session",
        title: event.title,
        detail: event.detail || "",
        scope: event.scope || "Local",
        time: event.time || new Date().toISOString()
      });
    }
  };

  if (state.project.name || state.project.buyer) {
    addEvent({
      actor: projectValue("buyer", "Buyer workspace"),
      title: "Project context prepared",
      detail: projectValue("name", "Unnamed project"),
      scope: "Project"
    });
  }
  if (state.shortlist.length) {
    addEvent({ title: "Shortlist contains buyer-selected products", detail: `${state.shortlist.length} products shortlisted`, scope: "Sourcing" });
  }
  if (state.compare.length) {
    addEvent({ title: "Comparison desk prepared", detail: `${state.compare.length} products compared`, scope: "Sourcing" });
  }
  if (state.quotes.length) {
    addEvent({ title: "Quote tracker records saved", detail: `${state.quotes.length} quote records in local browser`, scope: "Commercial" });
  }
  if (state.supplierReplies.length) {
    addEvent({ title: "Supplier inbox activity logged", detail: `${state.supplierReplies.length} replies captured`, scope: "Supplier" });
  }
  if (state.sourceLeads.length) {
    addEvent({ title: "Source intake leads saved", detail: `${state.sourceLeads.length} source leads awaiting or passing review`, scope: "Source review" });
  }
  if (data.learning.approved || data.learning.tenantOnly || data.learning.blocked) {
    addEvent({
      title: "Learning queue decisions recorded",
      detail: `${data.learning.approved} approved, ${data.learning.tenantOnly} tenant-only, ${data.learning.blocked} blocked`,
      scope: "AI governance"
    });
  }
  if (data.aiLoop.eligible.length) {
    addEvent({
      title: "AI Loop has governed influence candidates",
      detail: `${data.aiLoop.eligible.length} candidates can influence local recommendations`,
      scope: "AI loop"
    });
  }
  if (data.reviewItems.length) {
    addEvent({ title: "Evidence review board has items", detail: `${data.reviewItems.length} evidence or risk items visible`, scope: "Review" });
  }

  if (!events.length) {
    addEvent({
      title: "No buyer activity captured yet",
      detail: "Start with project context, shortlist, quotes, source leads, or learning approvals.",
      scope: "Starter"
    });
  }

  return events.slice(0, 10);
}

function renderTenantAdmin() {
  if (!els.tenantAdminSummary || !els.tenantRoleGrid || !els.tenantControlGrid || !els.tenantAuditList) {
    return;
  }

  const data = tenantAdminData();
  els.tenantAdminSummary.innerHTML = [
    tenantSummaryTemplate("Admin readiness", `${data.adminReadiness}%`, data.adminStatus),
    tenantSummaryTemplate("Audit events", data.auditEvents.length, "Generated locally"),
    tenantSummaryTemplate("Export records", data.exportableRecords, "Buyer-controlled files"),
    tenantSummaryTemplate("Learning decisions", data.learning.approved + data.learning.tenantOnly + data.learning.blocked, "Approved, tenant-only, or blocked")
  ].join("");

  if (els.tenantAdminStatus) {
    els.tenantAdminStatus.textContent = `${data.adminStatus}. Backend accounts, persistent audit logs, and real permissions are still future SaaS work.`;
  }

  els.tenantRoleGrid.innerHTML = tenantRoleCards(data).map(tenantRoleTemplate).join("");
  els.tenantControlGrid.innerHTML = tenantControlCards(data).map(tenantControlTemplate).join("");
  els.tenantAuditList.innerHTML = data.auditEvents.map(tenantAuditTemplate).join("");
}

function tenantSummaryTemplate(label, value, detail) {
  return `
    <article>
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(String(value))}</strong>
      <small>${escapeHtml(detail)}</small>
    </article>
  `;
}

function tenantRoleTemplate(role) {
  return `
    <article class="tenant-role-card ${escapeHtml(role.className)}">
      <span>Role model</span>
      <h3>${escapeHtml(role.title)}</h3>
      <p>${escapeHtml(role.detail)}</p>
      <ul>${role.permissions.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
    </article>
  `;
}

function tenantControlTemplate(control) {
  return `
    <article class="tenant-control-card ${escapeHtml(control.className)}">
      <span>Control check</span>
      <h3>${escapeHtml(control.title)}</h3>
      <p>${escapeHtml(control.detail)}</p>
      <ul>${control.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
    </article>
  `;
}

function tenantAuditTemplate(event) {
  return `
    <article class="tenant-audit-event">
      <span>${escapeHtml(event.scope)}</span>
      <div>
        <strong>${escapeHtml(event.title)}</strong>
        <p>${escapeHtml(event.detail)}</p>
      </div>
      <em>${escapeHtml(event.actor)}</em>
    </article>
  `;
}

function tenantAdminBriefText() {
  const data = tenantAdminData();
  const roles = tenantRoleCards(data).map((role, index) => `${index + 1}. ${role.title}: ${role.permissions.join("; ")}`).join("\n");
  const controls = tenantControlCards(data).map((control, index) => `${index + 1}. ${control.title}: ${control.detail}`).join("\n");
  const events = data.auditEvents.map((event, index) => `${index + 1}. [${event.scope}] ${event.title} - ${event.detail}`).join("\n");

  return `InduScout tenant admin foundation brief
Prepared on ${formatCopyDate()}

Project: ${projectValue("name", "TBC")}
Buyer/company: ${projectValue("buyer", "TBC")}
Governance boundary: ${state.governancePolicy.boundary}
Admin readiness: ${data.adminReadiness}% (${data.adminStatus})

Role model:
${roles}

Control checks:
${controls}

Audit trail preview:
${events}

SaaS readiness principle:
This static beta previews the admin control plane only. Real SaaS launch still requires authentication, tenant isolation, role permissions, server-side validation, persistent audit logs, encryption, retention/deletion workflows, and privacy terms before buyer data is stored centrally.`;
}

async function copyTenantAdminBrief() {
  const text = tenantAdminBriefText();
  try {
    await navigator.clipboard.writeText(text);
    if (els.copyTenantAdminBrief) {
      els.copyTenantAdminBrief.textContent = "Admin brief copied";
      setTimeout(() => {
        els.copyTenantAdminBrief.textContent = "Copy admin brief";
      }, 1400);
    }
  } catch {
    window.prompt("Copy admin brief", text);
  }
}

function exportTenantAdminJson() {
  const data = tenantAdminData();
  downloadFile(
    `InduScout-Tenant-Admin-${new Date().toISOString().slice(0, 10)}.json`,
    JSON.stringify({ ...createSessionSnapshot(), tenantAdmin: { generatedAt: new Date().toISOString(), data, roles: tenantRoleCards(data), controls: tenantControlCards(data), generatedText: tenantAdminBriefText() } }, null, 2),
    "application/json;charset=utf-8"
  );
}

function integrationBlueprintData() {
  const tenant = tenantAdminData();
  const governance = governanceData();
  const aiLoop = aiLoopData();
  const scorecard = supplierScorecardData();
  const sourcePaths = products.reduce((count, product) => count + (Array.isArray(product.sources) ? product.sources.length : 0), 0);
  const activityPoints = [
    state.project.name || state.project.buyer,
    state.shortlist.length,
    state.quotes.length,
    state.supplierReplies.length,
    state.sourceLeads.length,
    state.learningRecords.length,
    Object.keys(state.learningApprovals).length
  ].filter(Boolean).length;
  const readiness = Math.min(96, Math.round((tenant.adminReadiness * 0.45) + (governance.guardrailScore * 0.2) + (activityPoints * 5) + (products.length ? 16 : 0)));

  return {
    readiness,
    status: readiness >= 82 ? "Integration blueprint is board-ready" : readiness >= 65 ? "Integration blueprint is credible for partner review" : "Integration blueprint needs more buyer activity",
    productRecords: products.length,
    sourcePaths,
    shortlistItems: state.shortlist.length,
    quoteRecords: state.quotes.length,
    supplierReplies: state.supplierReplies.length,
    sourceLeads: state.sourceLeads.length,
    learningDecisions: Object.keys(state.learningApprovals).length,
    tenant,
    governance,
    aiLoop,
    scorecard
  };
}

function integrationEndpointCards(data = integrationBlueprintData()) {
  return [
    {
      method: "GET",
      path: "/api/products/search",
      title: "Product discovery",
      readiness: data.productRecords ? "Contract-ready" : "Needs catalog data",
      boundary: "Public catalog data only",
      detail: "Search products by keyword, brand, SKU, category, application, source channel, and confidence signal.",
      fields: ["query", "category", "region", "sourceType", "confidence"]
    },
    {
      method: "POST",
      path: "/api/projects/{id}/rfq-pack",
      title: "RFQ pack builder",
      readiness: state.shortlist.length ? "Workflow proven locally" : "Needs shortlist activity",
      boundary: "Tenant workspace data",
      detail: "Generate RFQ packs, buyer notes, supplier emails, and procurement briefs from shortlist and project context.",
      fields: ["project", "shortlist", "buyerNotes", "deliveryCountry", "targetDate"]
    },
    {
      method: "POST",
      path: "/api/quotes",
      title: "Quote tracker",
      readiness: state.quotes.length ? "Workflow proven locally" : "Needs quote examples",
      boundary: "Commercial data, tenant-only",
      detail: "Capture supplier quote replies, pricing, validity, delivery terms, and follow-up status.",
      fields: ["supplier", "price", "quantity", "leadTime", "validUntil"]
    },
    {
      method: "POST",
      path: "/api/suppliers/replies",
      title: "Supplier inbox",
      readiness: state.supplierReplies.length ? "Workflow proven locally" : "Needs reply examples",
      boundary: "Supplier communication, tenant-only",
      detail: "Convert supplier messages into quote actions, data update requests, clarification emails, and next-step tasks.",
      fields: ["supplier", "subject", "message", "status", "nextAction"]
    },
    {
      method: "POST",
      path: "/api/learning/candidates",
      title: "Governed learning candidates",
      readiness: data.learningDecisions ? "Guardrails previewed" : "Needs approval activity",
      boundary: "Approved or tenant-only learning only",
      detail: "Promote sourcing outcomes into governed learning candidates after buyer approval and data boundary checks.",
      fields: ["outcome", "evidence", "risk", "approvalStatus", "tenantBoundary"]
    },
    {
      method: "GET",
      path: "/api/admin/audit-events",
      title: "Admin audit trail",
      readiness: "Backend required",
      boundary: "Admin-only tenant control plane",
      detail: "Expose immutable audit events for exports, role actions, learning approvals, and policy changes once server storage exists.",
      fields: ["actor", "event", "scope", "timestamp", "policy"]
    }
  ];
}

function integrationControlCards(data = integrationBlueprintData()) {
  return [
    {
      title: "Authentication and roles",
      status: "Backend required",
      detail: "Connectors must run behind organization accounts, RBAC, session expiry, and admin-managed permissions.",
      checks: ["Buyer, reviewer, admin, and supplier roles", "OAuth or enterprise identity later", "No shared secrets in frontend code"]
    },
    {
      title: "Tenant isolation",
      status: data.tenant.adminReadiness >= 70 ? "Designed" : "Draft",
      detail: "Project notes, quote pricing, supplier replies, and learning records must be separated by organization.",
      checks: ["Tenant-scoped API keys", "Server-side authorization", "No cross-tenant raw commercial data"]
    },
    {
      title: "Audit and governance",
      status: data.governance.guardrailScore >= 80 ? "Strong preview" : "Needs review",
      detail: "Every export, learning decision, supplier update, and admin policy change needs a durable audit event.",
      checks: ["Persistent event log", "Export history", "Learning approval trace"]
    },
    {
      title: "Rate limits and abuse controls",
      status: "SaaS gate",
      detail: "Search and integration endpoints need quota limits, validation, logging, and suspicious activity alerts.",
      checks: ["Input validation", "Request quotas", "Bot and scraping controls"]
    }
  ];
}

function integrationEvents(data = integrationBlueprintData()) {
  return [
    ["product.searched", state.query ? `Last search: ${state.query}` : "Searches are local in the static beta", "Finder"],
    ["shortlist.updated", `${data.shortlistItems} items currently shortlisted`, "RFQ"],
    ["rfq.exported", "RFQ pack and procurement brief exports are generated in-browser", "Export"],
    ["quote.received", `${data.quoteRecords} quote records saved locally`, "Quotes"],
    ["supplier.reply_logged", `${data.supplierReplies} supplier replies logged locally`, "Inbox"],
    ["learning.candidate_reviewed", `${data.learningDecisions} learning decisions recorded`, "AI governance"],
    ["admin.audit_previewed", `${data.tenant.auditEvents.length} audit preview events available`, "Admin"]
  ];
}

function renderIntegrationBlueprint() {
  if (!els.integrationSummary || !els.integrationEndpointGrid || !els.integrationControlGrid || !els.integrationEventList) {
    return;
  }

  const data = integrationBlueprintData();
  els.integrationSummary.innerHTML = [
    tenantSummaryTemplate("Integration readiness", `${data.readiness}%`, data.status),
    tenantSummaryTemplate("Endpoint contracts", integrationEndpointCards(data).length, "Future API surfaces"),
    tenantSummaryTemplate("Event types", integrationEvents(data).length, "Webhook-style workflow signals"),
    tenantSummaryTemplate("Source paths", data.sourcePaths, "Catalog, RFQ, and supplier links")
  ].join("");

  if (els.integrationStatus) {
    els.integrationStatus.textContent = `${data.status}. This public beta remains static: no live API, no server database, and no hidden data transfer.`;
  }

  els.integrationEndpointGrid.innerHTML = integrationEndpointCards(data).map(integrationEndpointTemplate).join("");
  els.integrationControlGrid.innerHTML = integrationControlCards(data).map(integrationControlTemplate).join("");
  els.integrationEventList.innerHTML = integrationEvents(data).map(integrationEventTemplate).join("");
}

function integrationEndpointTemplate(endpoint) {
  return `
    <article class="integration-endpoint-card">
      <div>
        <span>${escapeHtml(endpoint.method)}</span>
        <code>${escapeHtml(endpoint.path)}</code>
      </div>
      <h3>${escapeHtml(endpoint.title)}</h3>
      <p>${escapeHtml(endpoint.detail)}</p>
      <dl>
        <dt>Readiness</dt>
        <dd>${escapeHtml(endpoint.readiness)}</dd>
        <dt>Data boundary</dt>
        <dd>${escapeHtml(endpoint.boundary)}</dd>
      </dl>
      <small>${endpoint.fields.map((field) => escapeHtml(field)).join(" | ")}</small>
    </article>
  `;
}

function integrationControlTemplate(control) {
  return `
    <article class="integration-control-card">
      <span>${escapeHtml(control.status)}</span>
      <h3>${escapeHtml(control.title)}</h3>
      <p>${escapeHtml(control.detail)}</p>
      <ul>${control.checks.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
    </article>
  `;
}

function integrationEventTemplate(event) {
  const [name, detail, scope] = event;
  return `
    <article class="integration-event">
      <span>${escapeHtml(scope)}</span>
      <div>
        <strong>${escapeHtml(name)}</strong>
        <p>${escapeHtml(detail)}</p>
      </div>
    </article>
  `;
}

function integrationBriefText() {
  const data = integrationBlueprintData();
  const endpoints = integrationEndpointCards(data).map((endpoint, index) => `${index + 1}. ${endpoint.method} ${endpoint.path} - ${endpoint.title} (${endpoint.readiness}; ${endpoint.boundary})`).join("\n");
  const controls = integrationControlCards(data).map((control, index) => `${index + 1}. ${control.title}: ${control.status} - ${control.detail}`).join("\n");
  const events = integrationEvents(data).map((event, index) => `${index + 1}. ${event[0]} [${event[2]}] - ${event[1]}`).join("\n");

  return `InduScout v6.1 API and integration blueprint
Prepared on ${formatCopyDate()}

Project: ${projectValue("name", "TBC")}
Buyer/company: ${projectValue("buyer", "TBC")}
Integration readiness: ${data.readiness}% (${data.status})
Catalog records: ${data.productRecords}
Source paths: ${data.sourcePaths}
Quote records: ${data.quoteRecords}
Supplier replies: ${data.supplierReplies}
Learning decisions: ${data.learningDecisions}

Future endpoint contracts:
${endpoints}

Integration controls:
${controls}

Event stream preview:
${events}

Important boundary:
InduScout v6.1 is still a static public beta. These API routes, events, connectors, and admin controls are a blueprint for SaaS architecture, not live endpoints. Real integrations require authentication, tenant isolation, server-side authorization, rate limits, persistent audit logs, secure storage, deletion workflows, and partner-specific data processing agreements.`;
}

async function copyIntegrationBrief() {
  const text = integrationBriefText();
  try {
    await navigator.clipboard.writeText(text);
    if (els.copyIntegrationBrief) {
      els.copyIntegrationBrief.textContent = "Integration brief copied";
      setTimeout(() => {
        els.copyIntegrationBrief.textContent = "Copy integration brief";
      }, 1400);
    }
  } catch {
    window.prompt("Copy integration brief", text);
  }
}

function exportIntegrationJson() {
  const data = integrationBlueprintData();
  downloadFile(
    `InduScout-Integration-Blueprint-${new Date().toISOString().slice(0, 10)}.json`,
    JSON.stringify({ ...createSessionSnapshot(), integrationBlueprint: { generatedAt: new Date().toISOString(), data, endpoints: integrationEndpointCards(data), controls: integrationControlCards(data), events: integrationEvents(data), generatedText: integrationBriefText() } }, null, 2),
    "application/json;charset=utf-8"
  );
}

function saasGateData() {
  const tenant = tenantAdminData();
  const integration = integrationBlueprintData();
  const governance = governanceData();
  const aiLoop = aiLoopData();
  const evidenceItems = evidenceReviewItems();
  const activityScore = Math.min(20, Math.round((state.shortlist.length + state.quotes.length + state.supplierReplies.length + state.sourceLeads.length + state.learningRecords.length) * 2.5));
  const readiness = Math.min(92, Math.round((tenant.adminReadiness * 0.28) + (integration.readiness * 0.26) + (governance.guardrailScore * 0.22) + (aiLoop.readiness * 0.12) + activityScore + 6));
  const blockerCount = saasGateCards({ tenant, integration, governance, aiLoop, evidenceItems, readiness }, true).filter((card) => card.status === "Blocked").length;
  const backendRequired = saasGateCards({ tenant, integration, governance, aiLoop, evidenceItems, readiness }, true).filter((card) => card.status === "Backend required").length;

  return {
    readiness,
    status: readiness >= 82 && !blockerCount ? "Ready for backend architecture review" : readiness >= 68 ? "Good for pilot planning, not production SaaS" : "Keep strengthening controls before backend build",
    blockerCount,
    backendRequired,
    tenant,
    integration,
    governance,
    aiLoop,
    evidenceItems,
    activityScore
  };
}

function saasGateCards(data = saasGateData(), skipDerived = false) {
  const source = data;
  const hasProjectContext = Boolean(state.project.name || state.project.buyer || state.project.country);
  const hasCommercialExamples = state.quotes.length || state.supplierReplies.length || state.savingsRecords.length;
  const hasLearningControls = Object.keys(state.learningApprovals).length > 0 || source.governance.guardrailScore >= 80;
  const hasIntegrationPlan = source.integration.readiness >= 70;
  return [
    {
      title: "Identity and RBAC",
      status: "Backend required",
      score: source.tenant.adminReadiness >= 70 ? 72 : 58,
      owner: "Platform admin",
      detail: "Create organization accounts, role permissions, session expiry, and admin-managed access before shared buyer workspaces exist.",
      checks: ["Buyer, reviewer, admin, supplier roles", "Server-side authorization", "No client-only permission decisions"]
    },
    {
      title: "Tenant-safe data model",
      status: hasProjectContext ? "Designed" : "Needs project context",
      score: hasProjectContext ? 76 : 54,
      owner: "Backend architecture",
      detail: "Separate project, quote, supplier, learning, and export records by organization and workspace.",
      checks: ["Tenant ID on every private record", "Commercial data never crosses organizations", "Deletion and retention policy"]
    },
    {
      title: "API sandbox",
      status: hasIntegrationPlan ? "Ready to scope" : "Needs blueprint",
      score: hasIntegrationPlan ? 80 : 60,
      owner: "Integration lead",
      detail: "Turn endpoint cards into a controlled sandbox with test tokens, mock data, validation, and documented rate limits.",
      checks: ["Search API contract", "RFQ pack endpoint", "Quote and supplier reply endpoints"]
    },
    {
      title: "Persistent audit logs",
      status: "Backend required",
      score: source.tenant.auditEvents.length >= 4 ? 74 : 56,
      owner: "Security and compliance",
      detail: "Convert local audit previews into immutable server events for exports, approvals, policy changes, and API actions.",
      checks: ["Who did what and when", "Export history", "Learning decision trace"]
    },
    {
      title: "Privacy and consent",
      status: source.governance.guardrailScore >= 80 ? "Strong preview" : "Needs policy review",
      score: source.governance.guardrailScore,
      owner: "Trust and legal",
      detail: "Define what stays tenant-only, what can be exported, and what could ever be anonymized for network learning.",
      checks: ["No raw commercial sharing", "Personal data stripping", "Opt-in learning boundary"]
    },
    {
      title: "Learning governance",
      status: hasLearningControls ? "Governed preview" : "Needs approval activity",
      score: hasLearningControls ? Math.max(74, source.aiLoop.readiness) : 55,
      owner: "AI governance",
      detail: "Only approved or tenant-only signals can influence recommendations; blocked and unreviewed signals remain gated.",
      checks: ["Approval queue", "Risk labels", "Explainable recommendation influence"]
    },
    {
      title: "Commercial workflow evidence",
      status: hasCommercialExamples ? "Workflow proven locally" : "Needs buyer examples",
      score: hasCommercialExamples ? 78 : 52,
      owner: "Procurement product",
      detail: "Capture enough quote, supplier reply, cost, and award examples before designing production database tables.",
      checks: ["Quote records", "Supplier replies", "Buyer file and award pack outputs"]
    },
    {
      title: "Production operations",
      status: "Blocked",
      score: 42,
      owner: "SaaS operations",
      detail: "Production launch needs monitoring, backups, incident response, abuse controls, billing stance, and support workflows.",
      checks: ["Monitoring and logs", "Backups and recovery", "Incident and support process"]
    }
  ];
}

function saasGateSequence(data = saasGateData()) {
  return [
    ["01", "Account model", "Define organizations, workspaces, users, roles, and invite flow."],
    ["02", "Private data model", "Map project, quote, supplier, learning, export, and audit records to tenant-scoped tables."],
    ["03", "API sandbox", "Build mock endpoints from the integration contracts with validation, test keys, and rate limits."],
    ["04", "Audit and privacy", "Persist export, approval, admin, and API events with retention and deletion rules."],
    ["05", "Pilot cohort", `Use ${data.integration.productRecords} catalog records and real buyer workflows for a controlled pilot.`]
  ];
}

function renderSaasGate() {
  if (!els.saasGateSummary || !els.saasGateGrid || !els.saasGateSequence) {
    return;
  }

  const data = saasGateData();
  els.saasGateSummary.innerHTML = [
    tenantSummaryTemplate("SaaS readiness", `${data.readiness}%`, data.status),
    tenantSummaryTemplate("Backend gates", saasGateCards(data).length, "Identity, data, APIs, audit, privacy"),
    tenantSummaryTemplate("Required backend work", data.backendRequired, "Cannot be solved in static beta"),
    tenantSummaryTemplate("Blockers", data.blockerCount, "Must clear before production")
  ].join("");

  if (els.saasGateStatus) {
    els.saasGateStatus.textContent = `${data.status}. This is a planning gate only: no accounts, live API, server storage, billing, or shared tenant data exists yet.`;
  }

  els.saasGateGrid.innerHTML = saasGateCards(data).map(saasGateCardTemplate).join("");
  els.saasGateSequence.innerHTML = saasGateSequence(data).map(saasGateStepTemplate).join("");
}

function saasGateCardTemplate(card) {
  const statusClass = card.status === "Blocked" ? "blocked" : card.status === "Backend required" ? "backend" : card.score >= 75 ? "ready" : "review";
  return `
    <article class="saas-gate-card ${statusClass}">
      <div>
        <span>${escapeHtml(card.status)}</span>
        <strong>${escapeHtml(String(card.score))}</strong>
      </div>
      <h3>${escapeHtml(card.title)}</h3>
      <p>${escapeHtml(card.detail)}</p>
      <small>${escapeHtml(card.owner)}</small>
      <ul>${card.checks.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
    </article>
  `;
}

function saasGateStepTemplate(step) {
  const [number, title, detail] = step;
  return `
    <article class="saas-gate-step">
      <span>${escapeHtml(number)}</span>
      <div>
        <strong>${escapeHtml(title)}</strong>
        <p>${escapeHtml(detail)}</p>
      </div>
    </article>
  `;
}

function saasGateBriefText() {
  const data = saasGateData();
  const gates = saasGateCards(data).map((card, index) => `${index + 1}. ${card.title}: ${card.status}, score ${card.score}. Owner: ${card.owner}. ${card.detail}`).join("\n");
  const sequence = saasGateSequence(data).map((step) => `${step[0]}. ${step[1]} - ${step[2]}`).join("\n");

  return `InduScout v6.1 SaaS readiness gate
Prepared on ${formatCopyDate()}

Project: ${projectValue("name", "TBC")}
Buyer/company: ${projectValue("buyer", "TBC")}
SaaS readiness: ${data.readiness}% (${data.status})
Backend-required gates: ${data.backendRequired}
Production blockers: ${data.blockerCount}
Governance score: ${data.governance.guardrailScore}%
Integration readiness: ${data.integration.readiness}%
Admin readiness: ${data.tenant.adminReadiness}%

Launch gates:
${gates}

Backend migration sequence:
${sequence}

Operating rule:
InduScout should not move buyer accounts, quote storage, supplier replies, APIs, or learning signals into a shared backend until identity, tenant isolation, RBAC, server-side validation, audit logs, retention/deletion workflows, privacy controls, rate limits, monitoring, backups, and incident response are designed and tested. v6.1 is a planning and readiness simulator, not a live SaaS backend.`;
}

async function copySaasGateBrief() {
  const text = saasGateBriefText();
  try {
    await navigator.clipboard.writeText(text);
    if (els.copySaasGateBrief) {
      els.copySaasGateBrief.textContent = "SaaS gate brief copied";
      setTimeout(() => {
        els.copySaasGateBrief.textContent = "Copy SaaS gate brief";
      }, 1400);
    }
  } catch {
    window.prompt("Copy SaaS gate brief", text);
  }
}

function exportSaasGateJson() {
  const data = saasGateData();
  downloadFile(
    `InduScout-SaaS-Gate-${new Date().toISOString().slice(0, 10)}.json`,
    JSON.stringify({ ...createSessionSnapshot(), saasGate: { generatedAt: new Date().toISOString(), data, gates: saasGateCards(data), sequence: saasGateSequence(data), generatedText: saasGateBriefText() } }, null, 2),
    "application/json;charset=utf-8"
  );
}

function defaultBackendFoundation() {
  return {
    identity: "Not started",
    dataModel: "Local-only beta",
    audit: "Preview only",
    ops: "Not started",
    learning: "Local only",
    deployment: "Architecture discovery",
    owner: "",
    targetDate: "",
    notes: ""
  };
}

function foundationControlInputs() {
  return [
    els.foundationIdentity,
    els.foundationDataModel,
    els.foundationAudit,
    els.foundationOps,
    els.foundationLearning,
    els.foundationDeployment
  ].filter(Boolean);
}

function hydrateFoundationControls(plan = state.backendFoundation) {
  if (!els.foundationForm) {
    return;
  }

  const sanitized = sanitizeBackendFoundation(plan);
  els.foundationIdentity.value = sanitized.identity;
  els.foundationDataModel.value = sanitized.dataModel;
  els.foundationAudit.value = sanitized.audit;
  els.foundationOps.value = sanitized.ops;
  els.foundationLearning.value = sanitized.learning;
  els.foundationDeployment.value = sanitized.deployment;
  els.foundationOwner.value = sanitized.owner;
  els.foundationTargetDate.value = sanitized.targetDate;
  els.foundationNotes.value = sanitized.notes;
}

function foundationPlanFromFields() {
  return sanitizeBackendFoundation({
    identity: els.foundationIdentity?.value,
    dataModel: els.foundationDataModel?.value,
    audit: els.foundationAudit?.value,
    ops: els.foundationOps?.value,
    learning: els.foundationLearning?.value,
    deployment: els.foundationDeployment?.value,
    owner: els.foundationOwner?.value,
    targetDate: els.foundationTargetDate?.value,
    notes: els.foundationNotes?.value
  });
}

function foundationScoreFor(area, value) {
  const scores = {
    identity: {
      "Not started": 20,
      "Role map drafted": 45,
      "Organization accounts designed": 72,
      "SSO-ready plan": 88
    },
    dataModel: {
      "Local-only beta": 22,
      "Tenant schema drafted": 50,
      "Encryption and backups planned": 74,
      "Deletion workflow approved": 90
    },
    audit: {
      "Preview only": 20,
      "Event taxonomy drafted": 48,
      "Retention rules planned": 72,
      "Immutable log design ready": 88
    },
    ops: {
      "Not started": 18,
      "Support owner named": 43,
      "Incident runbook drafted": 68,
      "Monitoring and backup plan ready": 86
    },
    learning: {
      "Local only": 42,
      "Tenant-only rules drafted": 64,
      "Opt-in anonymization design": 78,
      "DPA and consent review ready": 90
    },
    deployment: {
      "Architecture discovery": 38,
      "Private API sandbox": 64,
      "Controlled tenant beta": 80,
      "Production SaaS": 92
    }
  };
  return scores[area]?.[value] || 20;
}

function foundationStatusLabel(score, blockers) {
  if (score >= 84 && blockers === 0) return "Ready for architecture review";
  if (score >= 72) return "Strong planning base";
  if (score >= 58) return "Needs security design depth";
  return "Early foundation draft";
}

function foundationPlanData() {
  const plan = sanitizeBackendFoundation(state.backendFoundation);
  const scores = {
    identity: foundationScoreFor("identity", plan.identity),
    dataModel: foundationScoreFor("dataModel", plan.dataModel),
    audit: foundationScoreFor("audit", plan.audit),
    ops: foundationScoreFor("ops", plan.ops),
    learning: foundationScoreFor("learning", plan.learning),
    deployment: foundationScoreFor("deployment", plan.deployment)
  };
  const maturityAverage = Math.round(Object.values(scores).reduce((sum, score) => sum + score, 0) / Object.values(scores).length);
  const saas = saasGateData();
  const governance = governanceData();
  const pilot = pilotOpsSummaryData();
  const ownerBoost = plan.owner ? 3 : 0;
  const reviewBoost = plan.targetDate ? 3 : 0;
  const notesBoost = plan.notes ? 2 : 0;
  const readiness = Math.min(98, Math.round(
    maturityAverage * 0.46 +
    saas.readiness * 0.25 +
    governance.guardrailScore * 0.14 +
    pilot.opsReadiness * 0.08 +
    ownerBoost +
    reviewBoost +
    notesBoost
  ));
  const controls = foundationControlCards({ plan, scores, saas, governance, pilot, readiness });
  const blockers = controls.filter((control) => control.status === "Blocked").length;
  const designReady = controls.filter((control) => control.score >= 72).length;
  return {
    plan,
    scores,
    maturityAverage,
    saas,
    governance,
    pilot,
    readiness,
    blockers,
    designReady,
    controls,
    status: foundationStatusLabel(readiness, blockers)
  };
}

function foundationControlCards(data = foundationPlanData()) {
  const { plan, scores, saas, governance, pilot } = data;
  const statusFor = (score) => score >= 82 ? "Ready to design" : score >= 68 ? "Needs detail" : score >= 45 ? "Architecture draft" : "Blocked";
  return [
    {
      title: "Identity and access",
      status: statusFor(scores.identity),
      score: scores.identity,
      owner: plan.owner || "Security owner TBC",
      detail: "Define organizations, workspaces, user roles, invite flow, session expiry, and server-side authorization before shared buyer data exists.",
      checks: ["No client-only permissions", "Admin-managed user lifecycle", "Buyer, reviewer, supplier, and platform roles"]
    },
    {
      title: "Tenant data boundary",
      status: statusFor(scores.dataModel),
      score: scores.dataModel,
      owner: "Backend architecture",
      detail: "Design tenant-scoped project, quote, supplier, pilot, learning, export, and audit records with deletion and retention rules.",
      checks: ["Tenant ID on private records", "Encrypted storage plan", "Deletion and retention workflow"]
    },
    {
      title: "Audit and evidence trail",
      status: statusFor(scores.audit),
      score: scores.audit,
      owner: "Security and compliance",
      detail: "Convert local export, approval, learning, policy, and admin events into persistent audit records suitable for buyer review.",
      checks: ["Event taxonomy", "Retention policy", "Tamper-resistant logs"]
    },
    {
      title: "API validation layer",
      status: saas.integration.readiness >= 74 && scores.deployment >= 64 ? "Ready to scope" : "Needs sandbox design",
      score: Math.round((saas.integration.readiness + scores.deployment) / 2),
      owner: "Platform engineering",
      detail: "Move from static blueprints to a private sandbox with auth, validation, rate limits, mock supplier data, and safe test keys.",
      checks: ["Input validation", "Rate limits", "No production secrets in client code"]
    },
    {
      title: "Operations and resilience",
      status: statusFor(scores.ops),
      score: scores.ops,
      owner: plan.owner || "Operations owner TBC",
      detail: "Prepare support ownership, incident response, monitoring, backups, recovery, abuse controls, and launch communications.",
      checks: ["Incident runbook", "Monitoring and alerting", "Backup and restore test"]
    },
    {
      title: "Governed learning boundary",
      status: governance.guardrailScore >= 80 && scores.learning >= 64 ? "Governed preview" : "Needs policy depth",
      score: Math.round((governance.guardrailScore + scores.learning) / 2),
      owner: "AI governance",
      detail: "Keep learning tenant-safe until consent, anonymization, approval queue, data processing terms, and audit traces are ready.",
      checks: ["Tenant-only default", "Opt-in network learning", "Blocked signals stay gated"]
    },
    {
      title: "Pilot evidence loop",
      status: pilot.total && pilot.opsReadiness >= 60 ? "Evidence forming" : "Needs pilot proof",
      score: pilot.total ? pilot.opsReadiness : 44,
      owner: "Product and pilot lead",
      detail: "Use controlled pilots to decide which backend records, permissions, exports, and supplier workflows deserve production build priority.",
      checks: ["Pilot owner", "Success metric", "Outcome and risk captured"]
    }
  ];
}

function foundationRoadmapSteps(data = foundationPlanData()) {
  return [
    ["01", "Security ownership", `Assign ${data.plan.owner || "a named owner"} and agree the backend review date ${data.plan.targetDate || "before private beta"}.`],
    ["02", "Tenant model", "Write the organization, workspace, role, invite, project, quote, supplier, learning, export, and audit entity map."],
    ["03", "Private sandbox", "Build a non-public API sandbox with validation, test tokens, mock data, and rate limits before storing real buyer data."],
    ["04", "Audit and deletion", "Implement export logs, approval logs, policy logs, retention windows, deletion requests, and restore testing."],
    ["05", "Controlled beta", `Use ${data.pilot.total || "curated"} pilot runs and SaaS Gate blockers to decide whether to open tenant accounts.`]
  ];
}

function renderFoundationPlanner() {
  if (!els.foundationSummary || !els.foundationMatrix || !els.foundationRoadmap) {
    return;
  }

  const data = foundationPlanData();
  els.foundationSummary.innerHTML = [
    tenantSummaryTemplate("Foundation readiness", `${data.readiness}%`, data.status),
    tenantSummaryTemplate("Controls design-ready", data.designReady, `${data.controls.length} backend controls`),
    tenantSummaryTemplate("Open blockers", data.blockers, data.blockers ? "Must clear before beta accounts" : "No blocked controls"),
    tenantSummaryTemplate("Pilot proof", data.pilot.total, `${data.pilot.completed} completed / ${data.pilot.active} active`)
  ].join("");
  if (els.foundationStatus) {
    els.foundationStatus.textContent = `${data.status}. Local-only planning model: no backend, tenant storage, accounts, billing, or shared learning exists yet.`;
  }
  els.foundationMatrix.innerHTML = data.controls.map(foundationControlCardTemplate).join("");
  els.foundationRoadmap.innerHTML = foundationRoadmapSteps(data).map(foundationStepTemplate).join("");
}

function foundationControlCardTemplate(control) {
  const statusClass = control.status === "Blocked" ? "blocked" : control.score >= 82 ? "ready" : control.score >= 68 ? "review" : "draft";
  return `
    <article class="foundation-card ${statusClass}">
      <div>
        <span>${escapeHtml(control.status)}</span>
        <strong>${escapeHtml(String(control.score))}</strong>
      </div>
      <h3>${escapeHtml(control.title)}</h3>
      <p>${escapeHtml(control.detail)}</p>
      <small>${escapeHtml(control.owner)}</small>
      <ul>${control.checks.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
    </article>
  `;
}

function foundationStepTemplate(step) {
  const [number, title, detail] = step;
  return `
    <article class="foundation-step">
      <span>${escapeHtml(number)}</span>
      <div>
        <strong>${escapeHtml(title)}</strong>
        <p>${escapeHtml(detail)}</p>
      </div>
    </article>
  `;
}

function saveFoundationPlanFromForm() {
  state.backendFoundation = foundationPlanFromFields();
  saveBackendFoundation();
  renderFoundationPlanner();
  if (els.foundationStatus) {
    const data = foundationPlanData();
    els.foundationStatus.textContent = `Saved SaaS foundation plan. Readiness ${data.readiness}%: ${data.status}.`;
  }
}

function resetFoundationPlan() {
  state.backendFoundation = defaultBackendFoundation();
  saveBackendFoundation();
  hydrateFoundationControls();
  renderFoundationPlanner();
  if (els.foundationStatus) {
    els.foundationStatus.textContent = "SaaS foundation plan reset to the public beta baseline.";
  }
}

function foundationBriefText() {
  state.backendFoundation = foundationPlanFromFields();
  const data = foundationPlanData();
  const controls = data.controls.map((control, index) => `${index + 1}. ${control.title}: ${control.status}, score ${control.score}. Owner: ${control.owner}. ${control.detail}`).join("\n");
  const sequence = foundationRoadmapSteps(data).map((step) => `${step[0]}. ${step[1]} - ${step[2]}`).join("\n");

  return `InduScout v6.1 Secure SaaS Foundation Brief
Prepared on ${formatCopyDate()}

Project: ${projectValue("name", "TBC")}
Buyer/company: ${projectValue("buyer", "TBC")}
Security owner: ${data.plan.owner || "TBC"}
Target review date: ${data.plan.targetDate || "TBC"}
Foundation readiness: ${data.readiness}% (${data.status})
Open blockers: ${data.blockers}
Design-ready controls: ${data.designReady}/${data.controls.length}
SaaS gate readiness: ${data.saas.readiness}%
Governance score: ${data.governance.guardrailScore}%
Pilot ops readiness: ${data.pilot.opsReadiness}%

Current foundation settings:
- Identity and RBAC: ${data.plan.identity}
- Tenant data model: ${data.plan.dataModel}
- Audit logging: ${data.plan.audit}
- Operations: ${data.plan.ops}
- Learning boundary: ${data.plan.learning}
- Backend target: ${data.plan.deployment}

Backend control matrix:
${controls}

Recommended build sequence:
${sequence}

Foundation notes:
${data.plan.notes || "No foundation notes captured yet."}

Operating boundary:
InduScout v6.1 is still a static public beta. Do not store confidential tender data, payment details, credentials, regulated personal data, private contracts, or sensitive supplier commercials in the public beta. Backend work should begin only after identity, tenant isolation, server-side validation, audit logs, privacy controls, deletion workflows, backups, monitoring, incident response, and learning governance are designed and tested.`;
}

async function copyFoundationBrief() {
  const text = foundationBriefText();
  try {
    await navigator.clipboard.writeText(text);
    if (els.copyFoundationBrief) {
      els.copyFoundationBrief.textContent = "Foundation brief copied";
      setTimeout(() => {
        els.copyFoundationBrief.textContent = "Copy foundation brief";
      }, 1400);
    }
  } catch {
    window.prompt("Copy foundation brief", text);
  }
}

function exportFoundationJson() {
  state.backendFoundation = foundationPlanFromFields();
  saveBackendFoundation();
  const data = foundationPlanData();
  downloadFile(
    `InduScout-SaaS-Foundation-${new Date().toISOString().slice(0, 10)}.json`,
    JSON.stringify({ ...createSessionSnapshot(), saasFoundation: { generatedAt: new Date().toISOString(), data, controls: data.controls, roadmap: foundationRoadmapSteps(data), generatedText: foundationBriefText() } }, null, 2),
    "application/json;charset=utf-8"
  );
}

function pilotPackData() {
  const saas = saasGateData();
  const integration = integrationBlueprintData();
  const evidenceItems = evidenceReviewItems();
  const totalProducts = products.length || 1;
  const verifiedCoverage = percentage(products.filter((product) => product.verified).length, totalProducts);
  const datasheetCoverage = percentage(products.filter((product) => product.datasheet).length, totalProducts);
  const workflowSignals = [
    products.length >= 60,
    sourceDirectory.length >= 20,
    state.shortlist.length > 0,
    state.quotes.length > 0,
    state.supplierReplies.length > 0,
    state.sourceLeads.length > 0,
    state.learningRecords.length > 0,
    Object.keys(state.learningApprovals).length > 0
  ].filter(Boolean).length;
  const readiness = Math.min(96, Math.round((saas.readiness * 0.28) + (integration.readiness * 0.2) + (verifiedCoverage * 0.18) + (datasheetCoverage * 0.14) + (workflowSignals * 4) + 8));

  return {
    readiness,
    status: readiness >= 82 ? "Ready for curated pilot conversations" : readiness >= 68 ? "Good for friendly early-adopter demos" : "Needs more workflow evidence before buyer pilot",
    categoryCount: categoryTaxonomy.length,
    productRecords: products.length,
    sourcePaths: products.reduce((count, product) => count + (Array.isArray(product.sources) ? product.sources.length : 0), 0),
    shortlistItems: state.shortlist.length,
    quoteRecords: state.quotes.length,
    supplierReplies: state.supplierReplies.length,
    sourceLeads: state.sourceLeads.length,
    evidenceItems: evidenceItems.length,
    workflowSignals,
    saas,
    integration,
    verifiedCoverage,
    datasheetCoverage
  };
}

function pilotPackCards(data = pilotPackData()) {
  return [
    {
      title: "Pilot scope",
      status: "Ready to brief",
      score: Math.min(95, 60 + data.categoryCount + Math.round(data.productRecords / 4)),
      detail: "Run a focused procurement pilot around search, shortlist, RFQ prep, quote tracking, supplier replies, and buyer file outputs.",
      proof: [`${data.categoryCount} beta categories`, `${data.productRecords} product records`, `${data.sourcePaths} source links`],
      output: "Pilot scope memo"
    },
    {
      title: "Buyer onboarding",
      status: projectValue("name", "") ? "Context available" : "Needs pilot context",
      score: projectValue("name", "") ? 82 : 62,
      detail: "Collect project name, buyer contact, target categories, country, timeline, sample parts, and verification expectations.",
      proof: ["Project RFQ workspace", "Missing-product intake", "Buyer verification reminder"],
      output: "Onboarding checklist"
    },
    {
      title: "Workflow proof",
      status: data.workflowSignals >= 5 ? "Strong local evidence" : "Add more examples",
      score: Math.min(92, 50 + data.workflowSignals * 6),
      detail: "Demonstrate the end-to-end buyer desk from finder to RFQ pack, quotes, scorecard, compliance, and buyer file.",
      proof: [`${data.shortlistItems} shortlist items`, `${data.quoteRecords} quotes`, `${data.supplierReplies} supplier replies`],
      output: "Workflow demo script"
    },
    {
      title: "Data room",
      status: "Ready for public beta",
      score: 84,
      detail: "Use README, Security, Privacy, Launch Checklist, sitemap, sample exports, and generated briefs as pilot evidence.",
      proof: ["README.md", "SECURITY.md", "PRIVACY.md", "LAUNCH_CHECKLIST.md"],
      output: "Pilot data-room index"
    },
    {
      title: "Success metrics",
      status: "Defined",
      score: 78,
      detail: "Measure time to shortlist, source confidence, datasheet coverage, RFQ completeness, quote response quality, and avoided risk.",
      proof: ["Fit score", "Source path count", "Review queue", "Supplier scorecard"],
      output: "Pilot KPI sheet"
    },
    {
      title: "Feedback loop",
      status: data.evidenceItems ? "Signals available" : "Needs pilot feedback",
      score: data.evidenceItems ? 80 : 60,
      detail: "Capture product requests, source corrections, supplier replies, learning records, and governed approval decisions after each pilot run.",
      proof: [`${data.evidenceItems} review items`, `${data.sourceLeads} source leads`, `${Object.keys(state.learningApprovals).length} learning decisions`],
      output: "Pilot learning report"
    },
    {
      title: "Partner/API story",
      status: data.integration.readiness >= 70 ? "Credible blueprint" : "Needs integration evidence",
      score: data.integration.readiness,
      detail: "Use integration contracts and SaaS gates to explain future ERP, supplier portal, RFQ, and analytics integrations.",
      proof: ["Endpoint contracts", "Event stream preview", "SaaS gate blockers"],
      output: "Partner integration appendix"
    },
    {
      title: "Pilot boundaries",
      status: "Clear beta limits",
      score: 86,
      detail: "Keep confidential data out of the public beta; use local browser storage and buyer-controlled exports until a secure backend exists.",
      proof: ["No login", "No backend storage", "No live API", "Local exports"],
      output: "Beta boundary note"
    }
  ];
}

function pilotPackSequence(data = pilotPackData()) {
  return [
    ["01", "Qualify pilot", "Pick one buyer team, one procurement lane, and 20-50 representative parts."],
    ["02", "Prepare sample run", `Use ${data.categoryCount} categories and current catalog records to build a controlled demo workflow.`],
    ["03", "Run buyer workflow", "Search, compare, shortlist, prepare RFQ pack, log quote replies, score suppliers, and export the buyer file."],
    ["04", "Collect feedback", "Capture missing parts, source corrections, supplier response quality, time saved, and workflow gaps."],
    ["05", "Prioritize SaaS build", "Convert pilot findings into backend, API, data, governance, and catalog priorities before production."],
    ["06", "Decide next cohort", "Invite another friendly buyer only after risks, missing data, and support load are understood."]
  ];
}

function renderPilotPack() {
  if (!els.pilotPackSummary || !els.pilotPackGrid || !els.pilotPackSequence) {
    return;
  }

  const data = pilotPackData();
  els.pilotPackSummary.innerHTML = [
    tenantSummaryTemplate("Pilot readiness", `${data.readiness}%`, data.status),
    tenantSummaryTemplate("Pilot cards", pilotPackCards(data).length, "Scope, workflow, proof, metrics"),
    tenantSummaryTemplate("Catalog base", data.productRecords, `${data.categoryCount} categories`),
    tenantSummaryTemplate("Proof signals", data.workflowSignals, "Local workflow evidence")
  ].join("");

  if (els.pilotPackStatus) {
    els.pilotPackStatus.textContent = `${data.status}. Use this as an early-adopter pack; keep sensitive buyer data outside the public beta.`;
  }

  els.pilotPackGrid.innerHTML = pilotPackCards(data).map(pilotPackCardTemplate).join("");
  els.pilotPackSequence.innerHTML = pilotPackSequence(data).map(pilotPackStepTemplate).join("");
}

function pilotPackCardTemplate(card) {
  const statusClass = card.score >= 82 ? "ready" : card.score >= 70 ? "review" : "needs";
  return `
    <article class="pilot-pack-card ${statusClass}">
      <div>
        <span>${escapeHtml(card.status)}</span>
        <strong>${escapeHtml(String(card.score))}</strong>
      </div>
      <h3>${escapeHtml(card.title)}</h3>
      <p>${escapeHtml(card.detail)}</p>
      <small>${escapeHtml(card.output)}</small>
      <ul>${card.proof.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
    </article>
  `;
}

function pilotPackStepTemplate(step) {
  const [number, title, detail] = step;
  return `
    <article class="pilot-pack-step">
      <span>${escapeHtml(number)}</span>
      <div>
        <strong>${escapeHtml(title)}</strong>
        <p>${escapeHtml(detail)}</p>
      </div>
    </article>
  `;
}

function pilotPackBriefText() {
  const data = pilotPackData();
  const cards = pilotPackCards(data).map((card, index) => `${index + 1}. ${card.title}: ${card.status}, score ${card.score}. Output: ${card.output}. ${card.detail}`).join("\n");
  const sequence = pilotPackSequence(data).map((step) => `${step[0]}. ${step[1]} - ${step[2]}`).join("\n");

  return `InduScout v6.1 Pilot Launch Pack
Prepared on ${formatCopyDate()}

Project: ${projectValue("name", "TBC")}
Buyer/company: ${projectValue("buyer", "TBC")}
Pilot readiness: ${data.readiness}% (${data.status})
Catalog base: ${data.categoryCount} categories, ${data.productRecords} product records, ${data.sourcePaths} source links
Workflow evidence: ${data.workflowSignals} proof signals
SaaS readiness: ${data.saas.readiness}%
Integration readiness: ${data.integration.readiness}%

Pilot pack:
${cards}

Pilot operating plan:
${sequence}

Boundary:
InduScout v6.1 is suitable for curated public-beta pilot conversations, demos, buyer workflow validation, launch-partner qualification, pilot ops tracking, and secure SaaS foundation planning. It is not yet a production SaaS service. Keep confidential tender data, payment details, credentials, and regulated personal data outside the public beta until accounts, tenant isolation, secure backend storage, audit logs, deletion workflows, and support operations are in place.`;
}

async function copyPilotPackBrief() {
  const text = pilotPackBriefText();
  try {
    await navigator.clipboard.writeText(text);
    if (els.copyPilotPackBrief) {
      els.copyPilotPackBrief.textContent = "Pilot brief copied";
      setTimeout(() => {
        els.copyPilotPackBrief.textContent = "Copy pilot brief";
      }, 1400);
    }
  } catch {
    window.prompt("Copy pilot brief", text);
  }
}

function exportPilotPackJson() {
  const data = pilotPackData();
  downloadFile(
    `InduScout-Pilot-Pack-${new Date().toISOString().slice(0, 10)}.json`,
    JSON.stringify({ ...createSessionSnapshot(), pilotPack: { generatedAt: new Date().toISOString(), data, cards: pilotPackCards(data), sequence: pilotPackSequence(data), generatedText: pilotPackBriefText() } }, null, 2),
    "application/json;charset=utf-8"
  );
}

function demoProofData() {
  const pilot = pilotPackData();
  const saas = saasGateData();
  const integration = integrationBlueprintData();
  const proofSignals = [
    products.length >= 60,
    categoryTaxonomy.length >= 10,
    sourceDirectory.length >= 20,
    state.shortlist.length > 0,
    state.quotes.length > 0,
    state.supplierReplies.length > 0,
    state.sourceLeads.length > 0,
    state.learningRecords.length > 0,
    Object.keys(state.learningApprovals).length > 0,
    pilot.readiness >= 70,
    saas.readiness >= 65,
    integration.readiness >= 70
  ].filter(Boolean).length;
  const readiness = Math.min(97, Math.round((pilot.readiness * 0.35) + (saas.readiness * 0.18) + (integration.readiness * 0.17) + (proofSignals * 3) + 8));

  return {
    readiness,
    status: readiness >= 84 ? "Ready for stakeholder demos" : readiness >= 70 ? "Ready for friendly walkthroughs" : "Needs more proof before external demos",
    proofSignals,
    catalogRecords: products.length,
    sourcePaths: products.reduce((count, product) => count + (Array.isArray(product.sources) ? product.sources.length : 0), 0),
    categories: categoryTaxonomy.length,
    reviewItems: evidenceReviewItems().length,
    pilot,
    saas,
    integration
  };
}

function demoProofCards(data = demoProofData()) {
  return [
    {
      title: "Procurement buyer",
      audience: "Buyer / sourcing lead",
      score: Math.min(94, 70 + state.shortlist.length * 4 + state.quotes.length * 5),
      status: state.shortlist.length || state.quotes.length ? "Strong story" : "Use catalog demo",
      value: "Find, compare, shortlist, and prepare RFQs faster while keeping verification visible.",
      proof: ["Finder", "Shortlist", "RFQ pack", "Supplier scorecard"],
      ask: "Share 20-50 representative parts for a controlled pilot."
    },
    {
      title: "Engineering reviewer",
      audience: "Maintenance / engineering",
      score: 82,
      status: "Review-ready",
      value: "Review specs, alternates, lifecycle, certification, and substitution risks before buying.",
      proof: ["Spec Match", "Alternates", "Approval Pack", "Product confidence"],
      ask: "Validate whether the review fields match real site approval needs."
    },
    {
      title: "Procurement manager",
      audience: "Head of procurement",
      score: Math.min(92, 72 + state.savingsRecords.length * 5 + state.supplierReplies.length * 4),
      status: "Executive-ready",
      value: "Show traceable sourcing decisions, quote comparisons, savings notes, and buyer file evidence.",
      proof: ["Decision Memo", "Savings", "Buyer File", "Compliance Gate"],
      ask: "Choose one low-risk spend lane for a measurable pilot."
    },
    {
      title: "Supplier partner",
      audience: "Distributor / OEM",
      score: data.integration.readiness,
      status: data.integration.readiness >= 75 ? "Partner-ready" : "Blueprint stage",
      value: "Explain how suppliers could submit better source evidence, quote replies, and corrected product data.",
      proof: ["Source Intake", "Supplier Inbox", "Integration Blueprint", "Source directory"],
      ask: "Provide source evidence and response samples for buyer validation."
    },
    {
      title: "Technology partner",
      audience: "ERP / API / platform partner",
      score: Math.min(90, Math.round((data.integration.readiness + data.saas.readiness) / 2)),
      status: "Architecture story",
      value: "Show future API boundaries, event streams, tenant controls, audit gates, and safe integration sequence.",
      proof: ["API contracts", "Event stream", "SaaS Gate", "Security baseline"],
      ask: "Review API sandbox scope and required security controls."
    },
    {
      title: "Investor / advisor",
      audience: "Founder conversation",
      score: data.readiness,
      status: data.readiness >= 84 ? "Demo-ready" : "Internal rehearsal",
      value: "Show a focused procurement wedge, buyer pain, workflow depth, launch discipline, and SaaS path.",
      proof: ["Pilot Pack", "SaaS Gate", "Learning Loop", "SEO Catalog"],
      ask: "Challenge the first pilot segment and go-to-market proof plan."
    }
  ];
}

function demoProofSequence(data = demoProofData()) {
  return [
    ["01", "Open with buyer pain", "Industrial buyers lose time across OEM sites, distributor pages, marketplaces, datasheets, RFQ emails, and old part numbers."],
    ["02", "Show product discovery", `Use the Finder and SEO catalog to search across ${data.catalogRecords} records, confidence signals, source paths, and procurement filters.`],
    ["03", "Build the RFQ workflow", "Shortlist items, open product detail, copy RFQ text, create procurement brief, and export buyer-controlled files."],
    ["04", "Prove decision support", "Compare products, track quotes, score suppliers, prepare decision memo, compliance checks, and buyer file evidence."],
    ["05", "Explain learning and governance", "Show local learning, review queue, AI loop, governance controls, tenant admin, and why shared learning must be opt-in and audited."],
    ["06", "Close with pilot path", "Use Pilot Pack, SaaS Gate, and Integration Blueprint to propose a safe early-adopter pilot without confidential backend storage."]
  ];
}

function demoProofObjections(data = demoProofData()) {
  return [
    {
      objection: "Is this a purchasing recommendation engine?",
      response: "No. InduScout is a discovery and RFQ preparation aid. Final buying validation remains with the buyer, OEM, authorized distributor, or supplier.",
      proof: "Buyer verification notices, confidence labels, and copied RFQ reminders."
    },
    {
      objection: "Where is the live backend or API?",
      response: "The current release is intentionally static. v5.4-v6.1 show the integration, SaaS, foundation, pilot, demo, value-proof, launch-partner, and pilot-ops plans before shared data is introduced.",
      proof: "Integration Blueprint, SaaS Gate, Security baseline, and Privacy Center."
    },
    {
      objection: "Can buyers enter confidential tender data?",
      response: "Not in the public beta. The pilot path should use sample or non-sensitive data until tenant isolation, secure storage, and audit logs exist.",
      proof: "Privacy note, SaaS Gate blockers, and Pilot boundaries."
    },
    {
      objection: "What makes this defensible over a simple catalog?",
      response: "The value is workflow depth: sourcing, RFQ, alternates, quotes, supplier replies, compliance, buyer file, governance, and learning loop in one buyer desk.",
      proof: `${data.proofSignals} local proof signals across catalog, workflow, governance, pilot, and integration readiness.`
    }
  ];
}

function renderDemoProofPack() {
  if (!els.demoProofSummary || !els.demoProofGrid || !els.demoProofSequence || !els.demoProofObjections) {
    return;
  }

  const data = demoProofData();
  els.demoProofSummary.innerHTML = [
    tenantSummaryTemplate("Demo readiness", `${data.readiness}%`, data.status),
    tenantSummaryTemplate("Stakeholders", demoProofCards(data).length, "Buyer, engineer, manager, partner, investor"),
    tenantSummaryTemplate("Proof signals", data.proofSignals, "Local evidence points"),
    tenantSummaryTemplate("Guided steps", demoProofSequence(data).length, "20-30 minute flow")
  ].join("");

  if (els.demoProofStatus) {
    els.demoProofStatus.textContent = `${data.status}. Use this to guide conversations; avoid presenting the public beta as a production SaaS backend.`;
  }

  els.demoProofGrid.innerHTML = demoProofCards(data).map(demoProofCardTemplate).join("");
  els.demoProofSequence.innerHTML = demoProofSequence(data).map(demoProofStepTemplate).join("");
  els.demoProofObjections.innerHTML = demoProofObjections(data).map(demoProofObjectionTemplate).join("");
}

function demoProofCardTemplate(card) {
  const statusClass = card.score >= 84 ? "ready" : card.score >= 72 ? "review" : "needs";
  return `
    <article class="demo-proof-card ${statusClass}">
      <div>
        <span>${escapeHtml(card.status)}</span>
        <strong>${escapeHtml(String(card.score))}</strong>
      </div>
      <h3>${escapeHtml(card.title)}</h3>
      <p>${escapeHtml(card.value)}</p>
      <small>${escapeHtml(card.audience)}</small>
      <ul>${card.proof.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      <em>${escapeHtml(card.ask)}</em>
    </article>
  `;
}

function demoProofStepTemplate(step) {
  const [number, title, detail] = step;
  return `
    <article class="demo-proof-step">
      <span>${escapeHtml(number)}</span>
      <div>
        <strong>${escapeHtml(title)}</strong>
        <p>${escapeHtml(detail)}</p>
      </div>
    </article>
  `;
}

function demoProofObjectionTemplate(item) {
  return `
    <article class="demo-proof-objection">
      <span>Objection</span>
      <div>
        <strong>${escapeHtml(item.objection)}</strong>
        <p>${escapeHtml(item.response)}</p>
        <small>${escapeHtml(item.proof)}</small>
      </div>
    </article>
  `;
}

function demoProofBriefText() {
  const data = demoProofData();
  const cards = demoProofCards(data).map((card, index) => `${index + 1}. ${card.title} (${card.audience}): ${card.status}, score ${card.score}. Value: ${card.value} Ask: ${card.ask}`).join("\n");
  const sequence = demoProofSequence(data).map((step) => `${step[0]}. ${step[1]} - ${step[2]}`).join("\n");
  const objections = demoProofObjections(data).map((item, index) => `${index + 1}. ${item.objection}\nResponse: ${item.response}\nProof: ${item.proof}`).join("\n\n");

  return `InduScout v6.1 Demo and Stakeholder Proof Pack
Prepared on ${formatCopyDate()}

Project: ${projectValue("name", "TBC")}
Buyer/company: ${projectValue("buyer", "TBC")}
Demo readiness: ${data.readiness}% (${data.status})
Catalog base: ${data.categories} categories, ${data.catalogRecords} product records, ${data.sourcePaths} source links
Proof signals: ${data.proofSignals}
Pilot readiness: ${data.pilot.readiness}%
SaaS readiness: ${data.saas.readiness}%
Integration readiness: ${data.integration.readiness}%

Stakeholder value map:
${cards}

Guided demo flow:
${sequence}

Objection handling:
${objections}

Boundary:
InduScout v6.1 is ready for guided stakeholder conversations, controlled public-beta demos, value-proof discussions, launch-partner outreach, pilot ops review, and backend foundation planning. It is not a production SaaS backend, purchasing authority, or live integration service. Keep confidential buyer data outside the public beta until secure tenant controls, audit logs, support operations, and backend storage are implemented.`;
}

async function copyDemoProofBrief() {
  const text = demoProofBriefText();
  try {
    await navigator.clipboard.writeText(text);
    if (els.copyDemoProofBrief) {
      els.copyDemoProofBrief.textContent = "Demo brief copied";
      setTimeout(() => {
        els.copyDemoProofBrief.textContent = "Copy demo brief";
      }, 1400);
    }
  } catch {
    window.prompt("Copy demo brief", text);
  }
}

function exportDemoProofJson() {
  const data = demoProofData();
  downloadFile(
    `InduScout-Demo-Proof-${new Date().toISOString().slice(0, 10)}.json`,
    JSON.stringify({ ...createSessionSnapshot(), demoProof: { generatedAt: new Date().toISOString(), data, stakeholders: demoProofCards(data), sequence: demoProofSequence(data), objections: demoProofObjections(data), generatedText: demoProofBriefText() } }, null, 2),
    "application/json;charset=utf-8"
  );
}

function valueProofData() {
  const savings = savingsSummaryData();
  const demo = demoProofData();
  const pilot = pilotPackData();
  const saas = saasGateData();
  const decision = quoteDecisionInsights();
  const learning = learningSummaryData();
  const acceptedRows = state.savingsRecords
    .map((record) => ({ record, metrics: savingsMetrics(record) }))
    .filter(({ record }) => ["Accepted", "Partially accepted"].includes(record.status));
  const pipelineRows = state.savingsRecords
    .map((record) => ({ record, metrics: savingsMetrics(record) }))
    .filter(({ record }) => ["Target set", "Supplier pending"].includes(record.status));
  const comparableQuotes = decision.scoredQuotes.filter((item) => item.priceTotal).length;
  const quoteRiskCount = decision.scoredQuotes.filter((item) => item.flags.length).length;
  const acceptedSavingsLabel = formatCurrencyTotals(sumSavingsByCurrency(acceptedRows));
  const pipelineSavingsLabel = formatCurrencyTotals(sumSavingsByCurrency(pipelineRows));
  const commercialSignals = [
    products.length >= 60,
    sourceDirectory.length >= 20,
    state.shortlist.length > 0,
    state.compare.length > 0,
    state.quotes.length > 0,
    comparableQuotes >= 2,
    state.supplierReplies.length > 0,
    state.savingsRecords.length > 0,
    acceptedRows.length > 0,
    state.learningRecords.length > 0,
    demo.readiness >= 84,
    pilot.readiness >= 82
  ].filter(Boolean).length;
  const readiness = Math.min(98, Math.round(
    (demo.readiness * 0.2)
    + (pilot.readiness * 0.18)
    + (saas.readiness * 0.12)
    + (commercialSignals * 4)
    + Math.min(10, state.quotes.length * 2)
    + Math.min(10, acceptedRows.length * 5)
  ));

  return {
    readiness,
    status: readiness >= 84 ? "Executive value story ready" : readiness >= 70 ? "Good for pilot value discussion" : "Needs more quote and savings proof",
    commercialSignals,
    catalogRecords: products.length,
    sourcePaths: products.reduce((count, product) => count + (Array.isArray(product.sources) ? product.sources.length : 0), 0),
    shortlistItems: state.shortlist.length,
    compareItems: state.compare.length,
    quoteRecords: state.quotes.length,
    comparableQuotes,
    quoteRiskCount,
    supplierReplies: state.supplierReplies.length,
    savingsRecords: state.savingsRecords.length,
    acceptedSavingsCount: acceptedRows.length,
    acceptedSavingsLabel,
    pipelineSavingsLabel,
    largestSavingsLabel: savings.largestLabel,
    largestSavingsSupplier: savings.largestSupplier,
    learningRecords: state.learningRecords.length,
    learningWinRate: learning.winRateLabel,
    topLearningPattern: learning.topPattern || "TBC",
    recommendedSupplier: decision.recommended ? `${decision.recommended.quote.supplier} (${decision.recommended.score})` : "Add quote data",
    lowestPrice: decision.lowestPrice ? quoteTotalLabel(decision.lowestPrice.quote) : "TBC",
    fastestLead: decision.fastestLead ? `${decision.fastestLead.days} days` : "TBC",
    quotedValue: workspaceValueSummary(),
    demo,
    pilot,
    saas
  };
}

function valueProofCards(data = valueProofData()) {
  return [
    {
      title: "Search-to-RFQ acceleration",
      status: data.shortlistItems || data.quoteRecords ? "Workflow evidence" : "Catalog demo",
      score: Math.min(94, 62 + data.shortlistItems * 5 + data.quoteRecords * 4 + Math.min(12, data.catalogRecords / 10)),
      detail: "Shows how buyers move from product search into shortlist, RFQ text, procurement brief, and buyer-controlled exports.",
      proof: [`${data.catalogRecords} product records`, `${data.shortlistItems} shortlisted`, `${data.quoteRecords} quotes`],
      action: "Run a timed pilot: unknown item to RFQ-ready shortlist."
    },
    {
      title: "Quote decision discipline",
      status: data.comparableQuotes >= 2 ? "Comparable quotes" : "Needs more quotes",
      score: Math.min(92, 58 + data.comparableQuotes * 12 + (data.recommendedSupplier !== "Add quote data" ? 10 : 0)),
      detail: "Compares supplier price, lead time, payment terms, validity, and review flags before buyer recommendation.",
      proof: [`Decision lead: ${data.recommendedSupplier}`, `Lowest price: ${data.lowestPrice}`, `${data.quoteRiskCount} quote flags`],
      action: "Collect at least two supplier replies for the same procurement lane."
    },
    {
      title: "Savings evidence",
      status: data.acceptedSavingsCount ? "Accepted value" : data.savingsRecords ? "Pipeline value" : "Needs savings records",
      score: Math.min(93, 55 + data.savingsRecords * 7 + data.acceptedSavingsCount * 10),
      detail: "Tracks target, pending, partially accepted, and accepted savings so procurement can show buyer-side value.",
      proof: [`Accepted: ${data.acceptedSavingsLabel}`, `Pipeline: ${data.pipelineSavingsLabel}`, `Largest: ${data.largestSavingsLabel}`],
      action: "Save one accepted savings record with supplier evidence."
    },
    {
      title: "Risk and verification control",
      status: data.quoteRiskCount ? "Review flags visible" : "Verification visible",
      score: Math.min(91, 66 + data.demo.proofSignals * 2 + Math.min(10, data.quoteRiskCount * 2)),
      detail: "Keeps final buying validation with the buyer while surfacing certificates, datasheets, lifecycle, source path, and supplier risks.",
      proof: [`${data.demo.proofSignals} proof signals`, `${data.sourcePaths} source links`, `${data.quoteRiskCount} quote risks`],
      action: "Use the compliance and buyer file outputs in the pilot review."
    },
    {
      title: "Closed-loop learning maturity",
      status: data.learningRecords ? "Learning started" : "Ready to capture outcomes",
      score: Math.min(90, 58 + data.learningRecords * 6 + (data.topLearningPattern !== "TBC" ? 8 : 0)),
      detail: "Turns buyer outcomes into local learning, playbook candidates, governance decisions, and future opt-in network intelligence.",
      proof: [`${data.learningRecords} learning records`, `Win / placed: ${data.learningWinRate}`, `Top pattern: ${data.topLearningPattern}`],
      action: "Capture one post-RFQ lesson after each pilot event."
    },
    {
      title: "Pilot conversion proof",
      status: data.pilot.readiness >= 82 ? "Pilot-ready" : "Needs pilot proof",
      score: data.pilot.readiness,
      detail: "Connects the public beta to an early-adopter pilot with scope, success metrics, demo proof, SaaS gates, and safety boundaries.",
      proof: [`Pilot readiness: ${data.pilot.readiness}%`, `Demo readiness: ${data.demo.readiness}%`, `SaaS gate: ${data.saas.readiness}%`],
      action: "Invite one friendly buyer into a bounded, non-confidential pilot."
    }
  ];
}

function valueProofPath(data = valueProofData()) {
  return [
    ["01", "Show buyer pain", "Start with fragmented industrial sourcing, scattered source paths, and slow RFQ preparation."],
    ["02", "Demonstrate workflow", `Use ${data.catalogRecords} records and ${data.sourcePaths} source links to move from search into RFQ, compare, and buyer file.`],
    ["03", "Capture commercial proof", "Log supplier quotes, replies, negotiated targets, savings outcomes, and follow-up risks."],
    ["04", "Turn proof into management story", `Explain quoted value (${data.quotedValue}), accepted savings (${data.acceptedSavingsLabel}), and decision lead (${data.recommendedSupplier}).`],
    ["05", "Close the learning loop", "Convert buyer outcomes into local learning, playbooks, governance review, and explainable improvement signals."],
    ["06", "Scale safely", "Use SaaS gate, privacy notes, and pilot boundaries before introducing accounts, APIs, shared storage, or network learning."]
  ];
}

function valueProofEvidence(data = valueProofData()) {
  return [
    {
      title: "What we can prove today",
      detail: `${data.catalogRecords} product records, ${data.sourcePaths} source links, ${data.commercialSignals} commercial proof signals, and ${data.demo.readiness}% demo readiness.`,
      next: "Use this for public-beta demos and internal buyer conversations."
    },
    {
      title: "What improves with pilot usage",
      detail: "More quotes, supplier replies, accepted savings, missing-product requests, data corrections, and learning records will make the value score stronger.",
      next: "Run one controlled procurement lane and review outcomes weekly."
    },
    {
      title: "What must wait for SaaS",
      detail: "Shared tenant data, live supplier submissions, API integrations, confidential tender storage, billing, and cross-organization learning require secure backend controls.",
      next: "Keep public-beta examples non-confidential until the governed backend exists."
    }
  ];
}

function renderValueProofPack() {
  if (!els.valueProofSummary || !els.valueProofGrid || !els.valueProofPath || !els.valueProofEvidence) {
    return;
  }

  const data = valueProofData();
  els.valueProofSummary.innerHTML = [
    tenantSummaryTemplate("Value readiness", `${data.readiness}%`, data.status),
    tenantSummaryTemplate("Quoted value", data.quotedValue, `${data.quoteRecords} quote records`),
    tenantSummaryTemplate("Accepted savings", data.acceptedSavingsLabel, `${data.acceptedSavingsCount} accepted records`),
    tenantSummaryTemplate("Proof signals", data.commercialSignals, "Workflow + commercial evidence")
  ].join("");

  if (els.valueProofStatus) {
    els.valueProofStatus.textContent = `${data.status}. Use this for business-case discussions; keep financial claims tied to buyer-controlled evidence.`;
  }

  els.valueProofGrid.innerHTML = valueProofCards(data).map(valueProofCardTemplate).join("");
  els.valueProofPath.innerHTML = valueProofPath(data).map(valueProofStepTemplate).join("");
  els.valueProofEvidence.innerHTML = valueProofEvidence(data).map(valueProofEvidenceTemplate).join("");
}

function valueProofCardTemplate(card) {
  const statusClass = card.score >= 84 ? "ready" : card.score >= 70 ? "review" : "needs";
  return `
    <article class="value-proof-card ${statusClass}">
      <div>
        <span>${escapeHtml(card.status)}</span>
        <strong>${escapeHtml(String(Math.round(card.score)))}</strong>
      </div>
      <h3>${escapeHtml(card.title)}</h3>
      <p>${escapeHtml(card.detail)}</p>
      <ul>${card.proof.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      <em>${escapeHtml(card.action)}</em>
    </article>
  `;
}

function valueProofStepTemplate(step) {
  const [number, title, detail] = step;
  return `
    <article class="value-proof-step">
      <span>${escapeHtml(number)}</span>
      <div>
        <strong>${escapeHtml(title)}</strong>
        <p>${escapeHtml(detail)}</p>
      </div>
    </article>
  `;
}

function valueProofEvidenceTemplate(item) {
  return `
    <article class="value-proof-evidence-card">
      <span>Evidence note</span>
      <strong>${escapeHtml(item.title)}</strong>
      <p>${escapeHtml(item.detail)}</p>
      <small>${escapeHtml(item.next)}</small>
    </article>
  `;
}

function valueProofBriefText() {
  const data = valueProofData();
  const cards = valueProofCards(data).map((card, index) => `${index + 1}. ${card.title}: ${card.status}, score ${Math.round(card.score)}. ${card.detail} Action: ${card.action}`).join("\n");
  const path = valueProofPath(data).map((step) => `${step[0]}. ${step[1]} - ${step[2]}`).join("\n");
  const evidence = valueProofEvidence(data).map((item, index) => `${index + 1}. ${item.title}: ${item.detail} Next: ${item.next}`).join("\n");

  return `InduScout v6.1 Value Proof Board
Prepared on ${formatCopyDate()}

Project: ${projectValue("name", "TBC")}
Buyer/company: ${projectValue("buyer", "TBC")}
Value readiness: ${data.readiness}% (${data.status})
Commercial proof signals: ${data.commercialSignals}
Catalog base: ${data.catalogRecords} product records, ${data.sourcePaths} source links
Quoted value: ${data.quotedValue}
Decision lead: ${data.recommendedSupplier}
Lowest price signal: ${data.lowestPrice}
Fastest lead signal: ${data.fastestLead}
Accepted savings: ${data.acceptedSavingsLabel}
Pipeline savings: ${data.pipelineSavingsLabel}
Learning records: ${data.learningRecords}
Pilot readiness: ${data.pilot.readiness}%
Demo readiness: ${data.demo.readiness}%

Executive value cards:
${cards}

Buyer value path:
${path}

Evidence posture:
${evidence}

Boundary:
InduScout v6.1 is a public-beta value proof, launch-partner, pilot-ops, SaaS-foundation, and RFQ workflow aid. Treat all savings, supplier, quote, partner-fit, and pilot outcome claims as buyer-controlled evidence that must be validated against current supplier documents, stock, pricing, compatibility, warranty path, and internal approval. Shared tenant data, live supplier integrations, confidential tender storage, billing, and network learning must wait for governed SaaS controls.`;
}

async function copyValueProofBrief() {
  const text = valueProofBriefText();
  try {
    await navigator.clipboard.writeText(text);
    if (els.copyValueProofBrief) {
      els.copyValueProofBrief.textContent = "Value brief copied";
      setTimeout(() => {
        els.copyValueProofBrief.textContent = "Copy value brief";
      }, 1400);
    }
  } catch {
    window.prompt("Copy value brief", text);
  }
}

function exportValueProofJson() {
  const data = valueProofData();
  downloadFile(
    `InduScout-Value-Proof-${new Date().toISOString().slice(0, 10)}.json`,
    JSON.stringify({ ...createSessionSnapshot(), valueProof: { generatedAt: new Date().toISOString(), data, cards: valueProofCards(data), path: valueProofPath(data), evidence: valueProofEvidence(data), generatedText: valueProofBriefText() } }, null, 2),
    "application/json;charset=utf-8"
  );
}

function defaultLaunchPartner() {
  return {
    id: "",
    company: "",
    contact: "",
    segment: "Procurement team",
    region: "",
    pilotLane: "",
    status: "Target",
    fit: "High strategic fit",
    nextDate: "",
    notes: ""
  };
}

function launchPartnerFieldValue(element, fallback = "") {
  const value = String(element?.value || "").trim();
  return value || fallback;
}

function launchPartnerSnapshot() {
  const existing = state.launchPartners.find((partner) => partner.id === els.partnerId?.value);
  const company = launchPartnerFieldValue(els.partnerCompany, "Partner TBC");
  return sanitizeLaunchPartner({
    id: launchPartnerFieldValue(els.partnerId, `${Date.now()}-${safeFilenamePart(company) || "launch-partner"}`),
    savedAt: existing?.savedAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    company,
    contact: launchPartnerFieldValue(els.partnerContact, ""),
    segment: launchPartnerFieldValue(els.partnerSegment, "Procurement team"),
    region: launchPartnerFieldValue(els.partnerRegion, ""),
    pilotLane: launchPartnerFieldValue(els.partnerLane, ""),
    status: launchPartnerFieldValue(els.partnerStatus, "Target"),
    fit: launchPartnerFieldValue(els.partnerFit, "High strategic fit"),
    nextDate: launchPartnerFieldValue(els.partnerNextDate, ""),
    notes: launchPartnerFieldValue(els.partnerNotes, "")
  });
}

function hydrateLaunchPartnerForm(partner = defaultLaunchPartner()) {
  if (!els.partnerForm) {
    return;
  }

  const isBlank = !partner.id && !partner.company && !partner.contact && !partner.region && !partner.pilotLane && !partner.nextDate && !partner.notes;
  const cleanPartner = isBlank ? defaultLaunchPartner() : sanitizeLaunchPartner({ ...defaultLaunchPartner(), ...partner }) || defaultLaunchPartner();
  els.partnerId.value = cleanPartner.id || "";
  els.partnerCompany.value = cleanPartner.company === "Partner TBC" ? "" : cleanPartner.company;
  els.partnerContact.value = cleanPartner.contact || "";
  els.partnerSegment.value = cleanPartner.segment || "Procurement team";
  els.partnerRegion.value = cleanPartner.region || "";
  els.partnerLane.value = cleanPartner.pilotLane || "";
  els.partnerStatus.value = cleanPartner.status || "Target";
  els.partnerFit.value = cleanPartner.fit || "High strategic fit";
  els.partnerNextDate.value = cleanPartner.nextDate || "";
  els.partnerNotes.value = cleanPartner.notes || "";
  if (els.partnerPipelineStatus) {
    els.partnerPipelineStatus.textContent = cleanPartner.id
      ? "Editing saved launch partner. Changes stay local until exported or copied."
      : "Stored locally in this browser. Use sample or non-confidential buyer context during public beta.";
  }
}

function launchPartnerScore(partner, data = valueProofData()) {
  const statusBoost = {
    Target: 4,
    Contacted: 12,
    "Demo booked": 20,
    "Pilot proposed": 26,
    "Pilot active": 34,
    Converted: 40,
    "Not now": -8
  };
  const fitBoost = {
    "High strategic fit": 24,
    "Moderate fit": 14,
    "Needs qualification": 4,
    "Not a fit": -16
  };
  const segmentBoost = {
    "Procurement team": 12,
    "MRO distributor": 8,
    "OEM partner": 8,
    "System integrator": 6,
    "Technology partner": 6,
    "Investor / advisor": 5
  };
  let score = 35;
  score += statusBoost[partner.status] ?? 0;
  score += fitBoost[partner.fit] ?? 0;
  score += segmentBoost[partner.segment] ?? 0;
  if (partner.company && partner.company !== "Partner TBC") score += 8;
  if (partner.contact) score += 6;
  if (partner.region) score += 4;
  if (partner.pilotLane) score += 8;
  if (partner.nextDate) score += 5;
  if (partner.notes) score += 5;
  if (Number(data.readiness) >= 84) score += 5;
  if (launchPartnerNestedScore(data.pilot, "readiness") >= 82) score += 5;
  return Math.max(1, Math.min(100, Math.round(score)));
}

function launchPartnerNestedScore(source, key, fallback = 0) {
  const value = Number(source?.[key]);
  return Number.isFinite(value) ? value : fallback;
}

function launchPartnerScoreLabel(score) {
  if (score >= 84) return "Pilot-ready";
  if (score >= 70) return "Good candidate";
  if (score >= 55) return "Needs qualification";
  return "Low fit";
}

function launchPartnerSummaryData() {
  const data = valueProofData();
  const catalogBaseline = Math.min(72, 42 + Math.floor((Number(data.catalogRecords) || products.length || 0) / 7) + Math.floor((Number(data.sourcePaths) || sourceDirectory.length || 0) / 18));
  const valueReadiness = Number.isFinite(Number(data.readiness)) ? Number(data.readiness) : catalogBaseline;
  const pilotReadiness = launchPartnerNestedScore(data.pilot, "readiness", Math.max(0, valueReadiness - 6));
  const partners = state.launchPartners.map((partner) => ({ ...partner, score: launchPartnerScore(partner, data) }));
  const total = partners.length;
  const qualified = partners.filter((partner) => partner.score >= 70).length;
  const active = partners.filter((partner) => ["Pilot proposed", "Pilot active", "Converted"].includes(partner.status)).length;
  const followUps = partners.filter((partner) => ["Contacted", "Demo booked", "Pilot proposed"].includes(partner.status)).length;
  const averageScore = total ? Math.round(partners.reduce((sum, partner) => sum + partner.score, 0) / total) : 0;
  const pipelineReadiness = total ? Math.min(98, Math.round(valueReadiness * 0.38 + pilotReadiness * 0.22 + averageScore * 0.3 + Math.min(10, total * 2))) : Math.round(valueReadiness * 0.45);
  const topPartner = partners.sort((a, b) => b.score - a.score)[0];
  return {
    total,
    qualified,
    active,
    followUps,
    averageScore,
    pipelineReadiness,
    topPartner,
    status: pipelineReadiness >= 84 ? "Launch-ready pipeline" : pipelineReadiness >= 70 ? "Good launch motion" : "Build partner evidence"
  };
}

function renderLaunchPartnerPipeline() {
  if (!els.partnerSummary || !els.partnerList) {
    return;
  }

  const summary = launchPartnerSummaryData();
  els.partnerSummary.innerHTML = [
    tenantSummaryTemplate("Pipeline readiness", `${summary.pipelineReadiness}%`, summary.status),
    tenantSummaryTemplate("Partner candidates", summary.total, summary.total ? `${summary.qualified} qualified` : "Add first pilot candidate"),
    tenantSummaryTemplate("Active lanes", summary.active, "Proposed, active, or converted"),
    tenantSummaryTemplate("Follow-ups", summary.followUps, summary.followUps ? "Next buyer action needed" : "No open follow-up")
  ].join("");

  if (!state.launchPartners.length) {
    els.partnerList.innerHTML = `
      <article class="partner-empty">
        <strong>No launch partners saved yet</strong>
        <p>Add a friendly buyer, distributor, OEM, advisor, or technology partner candidate. InduScout will score pilot readiness, generate outreach text, and export a clean pipeline register.</p>
      </article>
    `;
    return;
  }

  const data = valueProofData();
  const sorted = [...state.launchPartners].sort((a, b) => launchPartnerScore(b, data) - launchPartnerScore(a, data));
  els.partnerList.innerHTML = sorted.map((partner) => launchPartnerCardTemplate(partner, data)).join("");
}

function launchPartnerCardTemplate(partner, data = valueProofData()) {
  const score = launchPartnerScore(partner, data);
  const label = launchPartnerScoreLabel(score);
  const statusClass = score >= 84 ? "ready" : score >= 70 ? "review" : score >= 55 ? "needs" : "risk";
  const next = partner.nextDate || "Next date TBC";
  return `
    <article class="partner-card ${statusClass}">
      <div class="partner-card-head">
        <div>
          <span>${escapeHtml(partner.segment)}</span>
          <h3>${escapeHtml(partner.company)}</h3>
          <p>${escapeHtml(partner.contact || "Contact path TBC")}</p>
        </div>
        <div class="partner-score">
          <span>${escapeHtml(label)}</span>
          <strong>${escapeHtml(String(score))}</strong>
        </div>
      </div>
      <dl class="partner-facts">
        <div><dt>Status</dt><dd>${escapeHtml(partner.status)}</dd></div>
        <div><dt>Fit</dt><dd>${escapeHtml(partner.fit)}</dd></div>
        <div><dt>Region</dt><dd>${escapeHtml(partner.region || "Global / TBC")}</dd></div>
        <div><dt>Pilot lane</dt><dd>${escapeHtml(partner.pilotLane || "Lane TBC")}</dd></div>
        <div><dt>Next action</dt><dd>${escapeHtml(next)}</dd></div>
      </dl>
      ${partner.notes ? `<p class="partner-notes">${escapeHtml(partner.notes)}</p>` : ""}
      <div class="partner-card-actions">
        <button type="button" data-load-partner="${escapeHtml(partner.id)}">Load</button>
        <button type="button" data-copy-partner="${escapeHtml(partner.id)}">Copy outreach</button>
        <button type="button" data-remove-partner="${escapeHtml(partner.id)}">Remove</button>
      </div>
    </article>
  `;
}

function saveLaunchPartnerFromForm() {
  const partner = launchPartnerSnapshot();
  if (!partner) {
    return;
  }

  const existingIndex = state.launchPartners.findIndex((item) => item.id === partner.id);
  if (existingIndex >= 0) {
    state.launchPartners.splice(existingIndex, 1, partner);
  } else {
    state.launchPartners.unshift(partner);
  }
  state.launchPartners = state.launchPartners.map(sanitizeLaunchPartner).filter(Boolean).slice(0, 120);
  saveLaunchPartners();
  hydrateLaunchPartnerForm(partner);
  renderLaunchPartnerPipeline();
  renderPilotOpsBoard();
  if (els.partnerPipelineStatus) {
    els.partnerPipelineStatus.textContent = `Saved ${partner.company}. Qualification score ${launchPartnerScore(partner)}.`;
  }
}

function loadLaunchPartnerToForm(id) {
  const partner = state.launchPartners.find((item) => item.id === id);
  if (!partner) {
    return;
  }
  hydrateLaunchPartnerForm(partner);
  if (els.partnerForm) {
    els.partnerForm.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function removeLaunchPartner(id) {
  const partner = state.launchPartners.find((item) => item.id === id);
  state.launchPartners = state.launchPartners.filter((item) => item.id !== id);
  saveLaunchPartners();
  if (els.partnerId?.value === id) {
    hydrateLaunchPartnerForm();
  }
  renderLaunchPartnerPipeline();
  renderPilotOpsBoard();
  if (els.partnerPipelineStatus && partner) {
    els.partnerPipelineStatus.textContent = `Removed ${partner.company} from the local launch pipeline.`;
  }
}

function clearLaunchPartners() {
  if (!state.launchPartners.length) {
    if (els.partnerPipelineStatus) {
      els.partnerPipelineStatus.textContent = "No launch partners to clear.";
    }
    return;
  }

  const confirmed = window.confirm("Clear all locally saved launch partner candidates?");
  if (!confirmed) {
    return;
  }
  state.launchPartners = [];
  saveLaunchPartners();
  hydrateLaunchPartnerForm();
  renderLaunchPartnerPipeline();
  renderPilotOpsBoard();
  if (els.partnerPipelineStatus) {
    els.partnerPipelineStatus.textContent = "Launch partner pipeline cleared locally.";
  }
}

function launchPartnerOutreachText(partner = launchPartnerSnapshot()) {
  const data = valueProofData();
  const pilotReadiness = launchPartnerNestedScore(data.pilot, "readiness", 0);
  const demoReadiness = launchPartnerNestedScore(data.demo, "readiness", 0);
  const score = partner ? launchPartnerScore(partner, data) : 0;
  const label = launchPartnerScoreLabel(score);
  return `InduScout launch partner outreach
Prepared on ${formatCopyDate()}

Partner candidate: ${partner?.company || "Partner TBC"}
Contact path: ${partner?.contact || "TBC"}
Partner type: ${partner?.segment || "TBC"}
Region: ${partner?.region || "TBC"}
Pilot lane: ${partner?.pilotLane || "TBC"}
Status: ${partner?.status || "Target"}
Qualification: ${label} (${score}/100)

Why we are reaching out:
InduScout is a procurement-first industrial product discovery and RFQ preparation workspace. The current public beta helps buyers search industrial products, compare sources, create shortlists, prepare RFQ packs, track quotes, review alternates, and build buyer-ready evidence before purchase decisions.

Current proof stack:
- ${data.catalogRecords} product records across ${categories.length} beta categories
- ${data.sourcePaths} source links across OEM, distributor, marketplace, surplus, and RFQ paths
- Value readiness: ${data.readiness}% (${data.status})
- Pilot readiness: ${pilotReadiness}%
- Demo readiness: ${demoReadiness}%

Suggested pilot:
Run a controlled, non-confidential workflow around ${partner?.pilotLane || "one industrial product lane"} using sample parts, public supplier links, buyer validation steps, RFQ preparation, and quote comparison.

Requested next step:
Would you be open to a short walkthrough and a small pilot conversation? The aim is to validate product discovery, RFQ preparation, source confidence, quote tracking, and buyer evidence before any production SaaS rollout.

Public beta boundary:
Please keep confidential tender data, credentials, payment details, personal data, and regulated records outside the beta until secure account, tenant isolation, audit log, deletion, and backend controls are launched.`;
}

async function copyLaunchPartnerOutreach() {
  const text = launchPartnerOutreachText();
  try {
    await navigator.clipboard.writeText(text);
    if (els.copyPartnerOutreach) {
      els.copyPartnerOutreach.textContent = "Outreach copied";
      setTimeout(() => {
        els.copyPartnerOutreach.textContent = "Copy outreach";
      }, 1400);
    }
  } catch {
    window.prompt("Copy launch partner outreach", text);
  }
}

async function copySavedLaunchPartnerOutreach(id, triggerButton) {
  const partner = state.launchPartners.find((item) => item.id === id);
  if (!partner) {
    return;
  }

  const text = launchPartnerOutreachText(partner);
  try {
    await navigator.clipboard.writeText(text);
    if (triggerButton) {
      triggerButton.textContent = "Copied";
      setTimeout(() => {
        triggerButton.textContent = "Copy outreach";
      }, 1400);
    }
  } catch {
    window.prompt("Copy launch partner outreach", text);
  }
}

function launchPartnerReportText() {
  const summary = launchPartnerSummaryData();
  const data = valueProofData();
  const pilotReadiness = launchPartnerNestedScore(data.pilot, "readiness", 0);
  const demoReadiness = launchPartnerNestedScore(data.demo, "readiness", 0);
  const partners = state.launchPartners.map((partner) => ({
    ...partner,
    score: launchPartnerScore(partner, data),
    label: launchPartnerScoreLabel(launchPartnerScore(partner, data))
  })).sort((a, b) => b.score - a.score);
  const partnerLines = partners.length
    ? partners.map((partner, index) => `${index + 1}. ${partner.company} - ${partner.segment}, ${partner.status}, ${partner.fit}, score ${partner.score} (${partner.label}). Region: ${partner.region || "TBC"}. Pilot lane: ${partner.pilotLane || "TBC"}. Next: ${partner.nextDate || "TBC"}. Notes: ${partner.notes || "None"}`).join("\n")
    : "No launch partners saved yet.";

  return `InduScout v6.1 Launch Partner Pipeline
Prepared on ${formatCopyDate()}

Pipeline readiness: ${summary.pipelineReadiness}% (${summary.status})
Partner candidates: ${summary.total}
Qualified candidates: ${summary.qualified}
Active lanes: ${summary.active}
Follow-ups: ${summary.followUps}
Average partner score: ${summary.averageScore || 0}

Value proof context:
- Catalog base: ${data.catalogRecords} product records and ${data.sourcePaths} source links
- Value readiness: ${data.readiness}% (${data.status})
- Pilot readiness: ${pilotReadiness}%
- Demo readiness: ${demoReadiness}%
- Commercial proof signals: ${data.commercialSignals}

Launch partner register:
${partnerLines}

Recommended next action:
Prioritize high-fit procurement teams and distributor/OEM partners for controlled, non-confidential pilot walkthroughs. Capture objections, pilot outcomes, and source validation evidence before moving toward secure SaaS backend work.

Boundary:
This pipeline is local-only public beta planning. Do not store confidential tender data, credentials, payment data, regulated personal data, or private supplier commercials until governed SaaS controls are live.`;
}

async function copyLaunchPartnerReport() {
  const text = launchPartnerReportText();
  try {
    await navigator.clipboard.writeText(text);
    if (els.copyPartnerReport) {
      els.copyPartnerReport.textContent = "Report copied";
      setTimeout(() => {
        els.copyPartnerReport.textContent = "Copy pipeline report";
      }, 1400);
    }
  } catch {
    window.prompt("Copy launch partner report", text);
  }
}

function launchPartnerExportTable() {
  const data = valueProofData();
  const headers = ["Company", "Contact", "Partner Type", "Region", "Pilot Lane", "Status", "Fit", "Score", "Qualification", "Next Action Date", "Notes", "Saved At", "Updated At"];
  const rows = state.launchPartners.map((partner) => {
    const score = launchPartnerScore(partner, data);
    return [
      partner.company,
      partner.contact,
      partner.segment,
      partner.region,
      partner.pilotLane,
      partner.status,
      partner.fit,
      score,
      launchPartnerScoreLabel(score),
      partner.nextDate,
      partner.notes,
      partner.savedAt,
      partner.updatedAt
    ];
  });
  return { headers, rows };
}

function exportLaunchPartnerCsv() {
  const { headers, rows } = launchPartnerExportTable();
  const csv = [headers, ...rows].map((row) => row.map(csvEscape).join(",")).join("\n");
  downloadFile(`InduScout-Launch-Partners-${new Date().toISOString().slice(0, 10)}.csv`, csv, "text/csv;charset=utf-8");
  if (els.partnerPipelineStatus) {
    els.partnerPipelineStatus.textContent = "Launch partner CSV exported.";
  }
}

function exportLaunchPartnerJson() {
  const summary = launchPartnerSummaryData();
  downloadFile(
    `InduScout-Launch-Partners-${new Date().toISOString().slice(0, 10)}.json`,
    JSON.stringify({ ...createSessionSnapshot(), launchPartnerPipeline: { generatedAt: new Date().toISOString(), summary, partners: state.launchPartners, generatedText: launchPartnerReportText() } }, null, 2),
    "application/json;charset=utf-8"
  );
  if (els.partnerPipelineStatus) {
    els.partnerPipelineStatus.textContent = "Launch partner JSON exported.";
  }
}

function defaultPilotRun() {
  return {
    id: "",
    partnerId: "",
    partnerName: "",
    lane: "",
    stage: "Planned",
    owner: "",
    startDate: "",
    targetDate: "",
    successMetric: "",
    risk: "Low risk",
    outcome: "",
    notes: ""
  };
}

function pilotRunFieldValue(element, fallback = "") {
  const value = String(element?.value || "").trim();
  return value || fallback;
}

function populatePilotPartnerOptions(selectedId = els.pilotOpsPartner?.value || "") {
  if (!els.pilotOpsPartner) {
    return;
  }

  const current = selectedId;
  els.pilotOpsPartner.innerHTML = "";
  const noneOption = document.createElement("option");
  noneOption.value = "";
  noneOption.textContent = "No partner selected";
  els.pilotOpsPartner.appendChild(noneOption);

  state.launchPartners.forEach((partner) => {
    const option = document.createElement("option");
    option.value = partner.id;
    option.textContent = `${partner.company} - ${partner.segment}`;
    els.pilotOpsPartner.appendChild(option);
  });

  if (current && state.launchPartners.some((partner) => partner.id === current)) {
    els.pilotOpsPartner.value = current;
  } else {
    els.pilotOpsPartner.value = "";
  }
}

function selectedPilotPartner(id = els.pilotOpsPartner?.value || "") {
  return state.launchPartners.find((partner) => partner.id === id) || null;
}

function pilotRunSnapshot() {
  const existing = state.pilotRuns.find((run) => run.id === els.pilotOpsId?.value);
  const partner = selectedPilotPartner();
  const lane = pilotRunFieldValue(els.pilotOpsLane, partner?.pilotLane || "Pilot lane TBC");
  return sanitizePilotRun({
    id: pilotRunFieldValue(els.pilotOpsId, `${Date.now()}-${safeFilenamePart(`${partner?.company || lane}-pilot`) || "pilot-run"}`),
    savedAt: existing?.savedAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    partnerId: partner?.id || "",
    partnerName: partner?.company || "",
    lane,
    stage: pilotRunFieldValue(els.pilotOpsStage, "Planned"),
    owner: pilotRunFieldValue(els.pilotOpsOwner, ""),
    startDate: pilotRunFieldValue(els.pilotOpsStartDate, ""),
    targetDate: pilotRunFieldValue(els.pilotOpsTargetDate, ""),
    successMetric: pilotRunFieldValue(els.pilotOpsSuccessMetric, ""),
    risk: pilotRunFieldValue(els.pilotOpsRisk, "Low risk"),
    outcome: pilotRunFieldValue(els.pilotOpsOutcome, ""),
    notes: pilotRunFieldValue(els.pilotOpsNotes, "")
  });
}

function hydratePilotOpsForm(run = defaultPilotRun()) {
  if (!els.pilotOpsForm) {
    return;
  }

  const isBlank = !run.id && !run.partnerId && !run.lane && !run.owner && !run.startDate && !run.targetDate && !run.successMetric && !run.outcome && !run.notes;
  const cleanRun = isBlank ? defaultPilotRun() : sanitizePilotRun({ ...defaultPilotRun(), ...run }) || defaultPilotRun();
  populatePilotPartnerOptions(cleanRun.partnerId || "");
  els.pilotOpsId.value = cleanRun.id || "";
  els.pilotOpsLane.value = cleanRun.lane === "Pilot lane TBC" ? "" : cleanRun.lane;
  els.pilotOpsStage.value = cleanRun.stage || "Planned";
  els.pilotOpsOwner.value = cleanRun.owner || "";
  els.pilotOpsStartDate.value = cleanRun.startDate || "";
  els.pilotOpsTargetDate.value = cleanRun.targetDate || "";
  els.pilotOpsSuccessMetric.value = cleanRun.successMetric || "";
  els.pilotOpsRisk.value = cleanRun.risk || "Low risk";
  els.pilotOpsOutcome.value = cleanRun.outcome || "";
  els.pilotOpsNotes.value = cleanRun.notes || "";
  if (els.pilotOpsStatus) {
    els.pilotOpsStatus.textContent = cleanRun.id
      ? "Editing saved pilot run. Changes stay local until exported or copied."
      : "Stored locally in this browser. Use controlled, non-confidential pilot context during public beta.";
  }
}

function pilotRunScore(run, data = valueProofData()) {
  const stageBoost = {
    Planned: 8,
    "Kickoff booked": 18,
    "In progress": 28,
    "Evidence review": 36,
    Completed: 42,
    Converted: 48,
    Paused: -8
  };
  const riskBoost = {
    "Low risk": 12,
    "Missing buyer time": 2,
    "Needs source evidence": 0,
    "Needs workflow proof": 0,
    "Security review needed": -8,
    "Commercial blocker": -10
  };
  const partner = run.partnerId ? state.launchPartners.find((item) => item.id === run.partnerId) : null;
  let score = 30;
  score += stageBoost[run.stage] ?? 0;
  score += riskBoost[run.risk] ?? 0;
  if (partner) score += Math.min(18, Math.round(launchPartnerScore(partner, data) / 6));
  if (run.lane && run.lane !== "Pilot lane TBC") score += 6;
  if (run.owner) score += 6;
  if (run.startDate) score += 4;
  if (run.targetDate) score += 5;
  if (run.successMetric) score += 9;
  if (run.outcome) score += 8;
  if (run.notes) score += 5;
  if (Number(data.readiness) >= 80) score += 4;
  return Math.max(1, Math.min(100, Math.round(score)));
}

function pilotRunScoreLabel(score) {
  if (score >= 84) return "Board-ready proof";
  if (score >= 70) return "Strong pilot";
  if (score >= 55) return "Needs evidence";
  return "Early draft";
}

function pilotOpsSummaryData() {
  const data = valueProofData();
  const runs = state.pilotRuns.map((run) => ({ ...run, score: pilotRunScore(run, data) }));
  const total = runs.length;
  const active = runs.filter((run) => ["Kickoff booked", "In progress", "Evidence review"].includes(run.stage)).length;
  const completed = runs.filter((run) => ["Completed", "Converted"].includes(run.stage)).length;
  const risks = runs.filter((run) => !["Low risk", "Missing buyer time"].includes(run.risk)).length;
  const averageScore = total ? Math.round(runs.reduce((sum, run) => sum + run.score, 0) / total) : 0;
  const partnerSummary = launchPartnerSummaryData();
  const opsReadiness = total
    ? Math.min(98, Math.round(averageScore * 0.45 + partnerSummary.pipelineReadiness * 0.25 + (Number(data.readiness) || 65) * 0.2 + Math.min(10, completed * 5)))
    : Math.max(28, Math.round(partnerSummary.pipelineReadiness * 0.55));
  const topRun = runs.sort((a, b) => b.score - a.score)[0];
  return {
    total,
    active,
    completed,
    risks,
    averageScore,
    opsReadiness,
    topRun,
    status: opsReadiness >= 84 ? "Pilot proof ready" : opsReadiness >= 70 ? "Pilot motion healthy" : "Needs controlled pilot evidence"
  };
}

function renderPilotOpsBoard() {
  if (!els.pilotOpsSummary || !els.pilotOpsList) {
    return;
  }

  populatePilotPartnerOptions();
  const summary = pilotOpsSummaryData();
  els.pilotOpsSummary.innerHTML = [
    tenantSummaryTemplate("Pilot ops readiness", `${summary.opsReadiness}%`, summary.status),
    tenantSummaryTemplate("Pilot runs", summary.total, summary.total ? `${summary.active} active` : "Add first pilot run"),
    tenantSummaryTemplate("Completed proof", summary.completed, "Completed or converted"),
    tenantSummaryTemplate("Open risks", summary.risks, summary.risks ? "Needs launch attention" : "No major risk flagged")
  ].join("");

  if (!state.pilotRuns.length) {
    els.pilotOpsList.innerHTML = `
      <article class="pilot-ops-empty">
        <strong>No pilot runs saved yet</strong>
        <p>Create a controlled pilot run from a launch partner, a product lane, or a buyer workflow. Use non-confidential sample data until the secure SaaS backend exists.</p>
      </article>
    `;
    return;
  }

  const data = valueProofData();
  const sorted = [...state.pilotRuns].sort((a, b) => pilotRunScore(b, data) - pilotRunScore(a, data));
  els.pilotOpsList.innerHTML = sorted.map((run) => pilotRunCardTemplate(run, data)).join("");
}

function pilotRunCardTemplate(run, data = valueProofData()) {
  const score = pilotRunScore(run, data);
  const label = pilotRunScoreLabel(score);
  const statusClass = score >= 84 ? "ready" : score >= 70 ? "review" : score >= 55 ? "needs" : "risk";
  const partner = run.partnerName || selectedPilotPartner(run.partnerId)?.company || "Partner TBC";
  return `
    <article class="pilot-ops-card ${statusClass}">
      <div class="pilot-ops-card-head">
        <div>
          <span>${escapeHtml(run.stage)}</span>
          <h3>${escapeHtml(run.lane)}</h3>
          <p>${escapeHtml(partner)}</p>
        </div>
        <div class="pilot-ops-score">
          <span>${escapeHtml(label)}</span>
          <strong>${escapeHtml(String(score))}</strong>
        </div>
      </div>
      <dl class="pilot-ops-facts">
        <div><dt>Owner</dt><dd>${escapeHtml(run.owner || "Owner TBC")}</dd></div>
        <div><dt>Start</dt><dd>${escapeHtml(run.startDate || "TBC")}</dd></div>
        <div><dt>Review</dt><dd>${escapeHtml(run.targetDate || "TBC")}</dd></div>
        <div><dt>Metric</dt><dd>${escapeHtml(run.successMetric || "Metric TBC")}</dd></div>
        <div><dt>Risk</dt><dd>${escapeHtml(run.risk)}</dd></div>
      </dl>
      ${run.outcome ? `<p class="pilot-ops-notes"><strong>Outcome:</strong> ${escapeHtml(run.outcome)}</p>` : ""}
      ${run.notes ? `<p class="pilot-ops-notes">${escapeHtml(run.notes)}</p>` : ""}
      <div class="pilot-ops-card-actions">
        <button type="button" data-load-pilot-run="${escapeHtml(run.id)}">Load</button>
        <button type="button" data-copy-pilot-run="${escapeHtml(run.id)}">Copy brief</button>
        <button type="button" data-remove-pilot-run="${escapeHtml(run.id)}">Remove</button>
      </div>
    </article>
  `;
}

function savePilotRunFromForm() {
  const run = pilotRunSnapshot();
  if (!run) {
    return;
  }

  const existingIndex = state.pilotRuns.findIndex((item) => item.id === run.id);
  if (existingIndex >= 0) {
    state.pilotRuns.splice(existingIndex, 1, run);
  } else {
    state.pilotRuns.unshift(run);
  }
  state.pilotRuns = state.pilotRuns.map(sanitizePilotRun).filter(Boolean).slice(0, 120);
  savePilotRuns();
  hydratePilotOpsForm(run);
  renderPilotOpsBoard();
  renderFoundationPlanner();
  if (els.pilotOpsStatus) {
    els.pilotOpsStatus.textContent = `Saved ${run.lane}. Pilot score ${pilotRunScore(run)}.`;
  }
}

function loadPilotRunToForm(id) {
  const run = state.pilotRuns.find((item) => item.id === id);
  if (!run) {
    return;
  }
  hydratePilotOpsForm(run);
  if (els.pilotOpsForm) {
    els.pilotOpsForm.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function removePilotRun(id) {
  const run = state.pilotRuns.find((item) => item.id === id);
  state.pilotRuns = state.pilotRuns.filter((item) => item.id !== id);
  savePilotRuns();
  if (els.pilotOpsId?.value === id) {
    hydratePilotOpsForm();
  }
  renderPilotOpsBoard();
  renderFoundationPlanner();
  if (els.pilotOpsStatus && run) {
    els.pilotOpsStatus.textContent = `Removed ${run.lane} from the local pilot board.`;
  }
}

function clearPilotRuns() {
  if (!state.pilotRuns.length) {
    if (els.pilotOpsStatus) {
      els.pilotOpsStatus.textContent = "No pilot runs to clear.";
    }
    return;
  }

  const confirmed = window.confirm("Clear all locally saved pilot runs?");
  if (!confirmed) {
    return;
  }
  state.pilotRuns = [];
  savePilotRuns();
  hydratePilotOpsForm();
  renderPilotOpsBoard();
  renderFoundationPlanner();
  if (els.pilotOpsStatus) {
    els.pilotOpsStatus.textContent = "Pilot ops board cleared locally.";
  }
}

function pilotRunBriefText(run = pilotRunSnapshot()) {
  const summary = pilotOpsSummaryData();
  const partner = run?.partnerId ? state.launchPartners.find((item) => item.id === run.partnerId) : null;
  const score = run ? pilotRunScore(run) : 0;
  return `InduScout v6.1 Pilot Run Brief
Prepared on ${formatCopyDate()}

Project: ${projectValue("name", "TBC")}
Buyer/company: ${projectValue("buyer", "TBC")}
Pilot partner: ${run?.partnerName || partner?.company || "Partner TBC"}
Pilot lane: ${run?.lane || "TBC"}
Stage: ${run?.stage || "Planned"}
Owner: ${run?.owner || "TBC"}
Start date: ${run?.startDate || "TBC"}
Target review date: ${run?.targetDate || "TBC"}
Success metric: ${run?.successMetric || "TBC"}
Primary risk: ${run?.risk || "TBC"}
Pilot score: ${score}/100 (${pilotRunScoreLabel(score)})

Current outcome:
${run?.outcome || "No outcome captured yet."}

Pilot notes:
${run?.notes || "No pilot notes captured yet."}

Pilot ops context:
- Pilot ops readiness: ${summary.opsReadiness}% (${summary.status})
- Saved pilot runs: ${summary.total}
- Active pilots: ${summary.active}
- Completed proof runs: ${summary.completed}
- Open risks: ${summary.risks}

Recommended next action:
Confirm the pilot scope, run one controlled non-confidential workflow, capture buyer friction, record source and quote evidence, then decide whether the result supports secure SaaS backend prioritization.

Public beta boundary:
Do not store confidential tender data, credentials, payment data, regulated personal data, or private supplier commercials in this static beta. Use sample data and buyer-approved public-source evidence until tenant isolation, audit logs, deletion controls, and secure backend storage are live.`;
}

async function copyPilotRunBrief() {
  const text = pilotRunBriefText();
  try {
    await navigator.clipboard.writeText(text);
    if (els.copyPilotOpsBrief) {
      els.copyPilotOpsBrief.textContent = "Brief copied";
      setTimeout(() => {
        els.copyPilotOpsBrief.textContent = "Copy pilot brief";
      }, 1400);
    }
  } catch {
    window.prompt("Copy pilot run brief", text);
  }
}

async function copySavedPilotRunBrief(id, triggerButton) {
  const run = state.pilotRuns.find((item) => item.id === id);
  if (!run) {
    return;
  }

  const text = pilotRunBriefText(run);
  try {
    await navigator.clipboard.writeText(text);
    if (triggerButton) {
      triggerButton.textContent = "Copied";
      setTimeout(() => {
        triggerButton.textContent = "Copy brief";
      }, 1400);
    }
  } catch {
    window.prompt("Copy pilot run brief", text);
  }
}

function pilotOpsReportText() {
  const summary = pilotOpsSummaryData();
  const data = valueProofData();
  const runs = state.pilotRuns.map((run) => ({
    ...run,
    score: pilotRunScore(run, data)
  })).map((run) => ({
    ...run,
    label: pilotRunScoreLabel(run.score)
  })).sort((a, b) => b.score - a.score);
  const lines = runs.length
    ? runs.map((run, index) => `${index + 1}. ${run.lane} - ${run.partnerName || "Partner TBC"}, ${run.stage}, score ${run.score} (${run.label}). Owner: ${run.owner || "TBC"}. Metric: ${run.successMetric || "TBC"}. Risk: ${run.risk}. Outcome: ${run.outcome || "None"}`).join("\n")
    : "No pilot runs saved yet.";

  return `InduScout v6.1 Pilot Ops Board
Prepared on ${formatCopyDate()}

Pilot ops readiness: ${summary.opsReadiness}% (${summary.status})
Pilot runs: ${summary.total}
Active pilots: ${summary.active}
Completed or converted pilots: ${summary.completed}
Open risks: ${summary.risks}
Average pilot score: ${summary.averageScore || 0}

Pilot register:
${lines}

Launch interpretation:
Use this board to separate genuine pilot proof from friendly interest. Strong runs should show a named partner or buyer lane, owner, success metric, current outcome, and explicit risk. Completed or converted pilots become evidence for the v6 secure backend sequence.

Boundary:
This is a local-only public beta operations board. It does not replace buyer validation, supplier due diligence, security review, tenant controls, or production support readiness.`;
}

async function copyPilotOpsReport() {
  const text = pilotOpsReportText();
  try {
    await navigator.clipboard.writeText(text);
    if (els.copyPilotOpsReport) {
      els.copyPilotOpsReport.textContent = "Report copied";
      setTimeout(() => {
        els.copyPilotOpsReport.textContent = "Copy pilot report";
      }, 1400);
    }
  } catch {
    window.prompt("Copy pilot ops report", text);
  }
}

function pilotOpsExportTable() {
  const data = valueProofData();
  const headers = ["Partner", "Pilot Lane", "Stage", "Owner", "Start Date", "Target Review Date", "Success Metric", "Risk", "Score", "Qualification", "Outcome", "Notes", "Saved At", "Updated At"];
  const rows = state.pilotRuns.map((run) => {
    const score = pilotRunScore(run, data);
    return [
      run.partnerName,
      run.lane,
      run.stage,
      run.owner,
      run.startDate,
      run.targetDate,
      run.successMetric,
      run.risk,
      score,
      pilotRunScoreLabel(score),
      run.outcome,
      run.notes,
      run.savedAt,
      run.updatedAt
    ];
  });
  return { headers, rows };
}

function exportPilotOpsCsv() {
  const { headers, rows } = pilotOpsExportTable();
  const csv = [headers, ...rows].map((row) => row.map(csvEscape).join(",")).join("\n");
  downloadFile(`InduScout-Pilot-Ops-${new Date().toISOString().slice(0, 10)}.csv`, csv, "text/csv;charset=utf-8");
  if (els.pilotOpsStatus) {
    els.pilotOpsStatus.textContent = "Pilot ops CSV exported.";
  }
}

function exportPilotOpsJson() {
  const summary = pilotOpsSummaryData();
  downloadFile(
    `InduScout-Pilot-Ops-${new Date().toISOString().slice(0, 10)}.json`,
    JSON.stringify({ ...createSessionSnapshot(), pilotOpsBoard: { generatedAt: new Date().toISOString(), summary, runs: state.pilotRuns, generatedText: pilotOpsReportText() } }, null, 2),
    "application/json;charset=utf-8"
  );
  if (els.pilotOpsStatus) {
    els.pilotOpsStatus.textContent = "Pilot ops JSON exported.";
  }
}

function selectedQuoteProduct() {
  return products.find((product) => product.id === els.quoteProduct?.value) || products[0];
}

function quoteFieldValue(element, fallback = "") {
  const value = String(element?.value || "").trim();
  return value || fallback;
}

function quoteFormSnapshot() {
  updateProjectFromFields();
  const product = selectedQuoteProduct();
  const existing = state.quotes.find((quote) => quote.id === els.quoteId?.value);
  const supplier = quoteFieldValue(els.quoteSupplier, "Supplier TBC");
  return {
    id: quoteFieldValue(els.quoteId, `${Date.now()}-${safeFilenamePart(`${supplier}-${product?.sku || "quote"}`).toLowerCase() || "quote"}`),
    savedAt: existing?.savedAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    projectName: projectValue("name", ""),
    buyer: projectValue("buyer", ""),
    buyerContact: projectValue("contact", ""),
    deliveryCountry: projectValue("country", ""),
    targetDate: projectValue("targetDate", ""),
    productId: product?.id || "",
    brand: product?.brand || "",
    sku: product?.sku || "",
    productName: product?.name || "",
    category: product?.category || "",
    supplier,
    status: quoteFieldValue(els.quoteStatus, "Requested"),
    currency: quoteFieldValue(els.quoteCurrency, "USD"),
    unitPrice: quoteFieldValue(els.quoteUnitPrice, ""),
    quantity: quoteFieldValue(els.quoteQuantity, product ? defaultQuantity(product.moq) : ""),
    leadTime: quoteFieldValue(els.quoteLeadTime, product?.lead || ""),
    moq: quoteFieldValue(els.quoteMoq, product?.moq || ""),
    paymentTerms: quoteFieldValue(els.quotePaymentTerms, "TBC"),
    deliveryTerms: quoteFieldValue(els.quoteDeliveryTerms, "TBC"),
    validUntil: quoteFieldValue(els.quoteValidUntil, ""),
    sourceUrl: quoteFieldValue(els.quoteSourceUrl, product?.sources[0]?.url || ""),
    notes: quoteFieldValue(els.quoteNotes, "")
  };
}

function hydrateQuoteForm(quote = {}) {
  if (!els.quoteProduct) {
    return;
  }

  const productId = quote.productId && products.some((product) => product.id === quote.productId) ? quote.productId : products[0]?.id || "";
  els.quoteId.value = quote.id || "";
  els.quoteProduct.value = productId;
  els.quoteSupplier.value = quote.supplier || "";
  els.quoteStatus.value = quote.status || "Requested";
  els.quoteCurrency.value = quote.currency || "USD";
  els.quoteUnitPrice.value = quote.unitPrice || "";
  els.quoteQuantity.value = quote.quantity || "";
  els.quoteLeadTime.value = quote.leadTime || "";
  els.quoteMoq.value = quote.moq || "";
  els.quotePaymentTerms.value = quote.paymentTerms || "";
  els.quoteDeliveryTerms.value = quote.deliveryTerms || "";
  els.quoteValidUntil.value = quote.validUntil || "";
  els.quoteSourceUrl.value = quote.sourceUrl || "";
  els.quoteNotes.value = quote.notes || "";
}

function prefillQuoteFromProduct() {
  const product = selectedQuoteProduct();
  if (!product) {
    return;
  }

  if (!els.quoteId.value) {
    els.quoteQuantity.value ||= defaultQuantity(product.moq);
    els.quoteLeadTime.value ||= product.lead;
    els.quoteMoq.value ||= product.moq;
    els.quoteSourceUrl.value ||= product.sources[0]?.url || "";
  }
}

function startQuoteForProduct(id) {
  if (!els.quoteProduct) {
    return;
  }

  closeProductDetail();
  clearQuoteForm();
  els.quoteProduct.value = id;
  prefillQuoteFromProduct();
  document.querySelector("#quotes")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function saveQuoteFromForm() {
  if (!els.quoteProduct) {
    return;
  }

  const quote = quoteFormSnapshot();
  if (!quote.supplier || quote.supplier === "Supplier TBC") {
    els.saveQuote.textContent = "Add supplier first";
    setTimeout(() => {
      els.saveQuote.textContent = "Save quote";
    }, 1200);
    return;
  }

  state.quotes = [quote, ...state.quotes.filter((item) => item.id !== quote.id)].slice(0, 80);
  saveQuoteRecords();
  hydrateQuoteForm(quote);
  renderQuoteTracker();
  renderPlaybookLab();
  populateReplyItems();
  renderSupplierInbox();
  renderGovernanceCenter();
  els.saveQuote.textContent = "Quote saved";
  setTimeout(() => {
    els.saveQuote.textContent = "Save quote";
  }, 1200);
}

function clearQuoteForm() {
  hydrateQuoteForm();
}

function clearQuoteRecords() {
  state.quotes = [];
  saveQuoteRecords();
  renderQuoteTracker();
  renderPlaybookLab();
  populateReplyItems();
  renderSupplierInbox();
  renderGovernanceCenter();
}

function loadQuoteToForm(id) {
  const quote = state.quotes.find((item) => item.id === id);
  if (!quote) {
    return;
  }

  hydrateQuoteForm(quote);
  els.quoteForm?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function removeQuoteRecord(id) {
  state.quotes = state.quotes.filter((quote) => quote.id !== id);
  saveQuoteRecords();
  renderQuoteTracker();
  renderPlaybookLab();
  populateReplyItems();
  renderSupplierInbox();
  renderGovernanceCenter();
}

function renderQuoteTracker() {
  if (!els.quoteList || !els.quoteSummary) {
    return;
  }

  populateCostQuotes();
  populateNegotiationQuotes();
  populateSavingsQuotes();
  renderLandedCostDesk();
  renderNegotiationDesk();
  const total = state.quotes.length;
  const received = state.quotes.filter((quote) => ["Received", "Best option"].includes(quote.status)).length;
  const followUp = state.quotes.filter((quote) => quote.status === "Follow-up needed").length;
  const decision = quoteDecisionInsights();
  const totalsByCurrency = quoteTotalsByCurrency();
  const valueSummary = Object.entries(totalsByCurrency)
    .map(([currency, value]) => `${currency} ${formatAmount(value)}`)
    .join(" | ") || "Add price + quantity";
  const decisionLead = decision.recommended ? `${decision.recommended.quote.supplier} (${decision.recommended.score})` : "Add quote data";
  const lowestLabel = decision.lowestPrice ? quoteTotalLabel(decision.lowestPrice.quote) : "Price TBC";
  const fastestLabel = decision.fastestLead ? `${decision.fastestLead.days} days` : "Lead time TBC";

  els.quoteSummary.innerHTML = `
    <article><span>Total quotes</span><strong>${total}</strong><small>${received} commercial ${received === 1 ? "reply" : "replies"} logged</small></article>
    <article><span>Decision lead</span><strong>${escapeHtml(decisionLead)}</strong><small>Highest current score</small></article>
    <article><span>Lowest price</span><strong>${escapeHtml(lowestLabel)}</strong><small>${escapeHtml(decision.lowestPrice?.quote.supplier || "Add comparable prices")}</small></article>
    <article><span>Fastest lead</span><strong>${escapeHtml(fastestLabel)}</strong><small>${escapeHtml(decision.fastestLead?.quote.supplier || "Add lead times")}</small></article>
    <article><span>Follow-ups</span><strong>${followUp}</strong><small>Need supplier action</small></article>
    <article class="wide"><span>Estimated value</span><strong>${escapeHtml(valueSummary)}</strong><small>Calculated when unit price and numeric quantity are available</small></article>
  `;

  if (els.quoteRegisterStatus) {
    els.quoteRegisterStatus.textContent = total ? `${total} saved ${total === 1 ? "quote" : "quotes"} in this browser` : "Stored locally in this browser";
  }

  if (!total) {
    els.quoteList.innerHTML = `
      <div class="empty-state quote-empty">
        Save supplier replies here after sending RFQs. Quote records can be exported as CSV/XLSX or copied into buyer review notes.
      </div>
    `;
    renderBuyerWorkspace();
    renderEvidenceReviewBoard();
    renderSupplierScorecard();
    renderLandedCostDesk();
    renderNegotiationDesk();
    renderSavingsRegister();
    renderValueProofPack();
    return;
  }

  els.quoteList.innerHTML = `${quoteDecisionPanel(decision)}${decision.scoredQuotes.map((item) => quoteCardTemplate(item.quote, decision)).join("")}`;
  renderBuyerWorkspace();
  renderEvidenceReviewBoard();
  renderSupplierScorecard();
  renderLandedCostDesk();
  renderNegotiationDesk();
  renderSavingsRegister();
  renderValueProofPack();
}

function quoteDecisionPanel(decision) {
  const recommendation = decision.recommended
    ? `${decision.recommended.quote.supplier} leads with a decision score of ${decision.recommended.score}.`
    : "Add supplier, price, lead time, payment terms, delivery terms, and validity to calculate a decision lead.";
  const lowest = decision.lowestPrice
    ? `${decision.lowestPrice.quote.supplier} has the lowest comparable total at ${quoteTotalLabel(decision.lowestPrice.quote)}.`
    : "No comparable price yet.";
  const fastest = decision.fastestLead
    ? `${decision.fastestLead.quote.supplier} has the fastest lead signal at ${decision.fastestLead.days} days.`
    : "No parsed lead time yet.";
  const riskCount = decision.scoredQuotes.filter((item) => item.flags.length).length;

  return `
    <section class="quote-decision-panel" aria-label="Quote decision guidance">
      <div>
        <span>Decision guidance</span>
        <strong>${escapeHtml(recommendation)}</strong>
        <p>${escapeHtml(lowest)} ${escapeHtml(fastest)}</p>
      </div>
      <div class="decision-chips">
        <span>${riskCount} ${riskCount === 1 ? "quote" : "quotes"} with review flags</span>
        <span>${decision.scoredQuotes.filter((item) => item.priceTotal).length} priced ${decision.scoredQuotes.filter((item) => item.priceTotal).length === 1 ? "quote" : "quotes"}</span>
        <span>${decision.scoredQuotes.filter((item) => item.days).length} lead-time ${decision.scoredQuotes.filter((item) => item.days).length === 1 ? "signal" : "signals"}</span>
      </div>
    </section>
  `;
}

function quoteCardTemplate(quote, decision) {
  const score = decision.scoredQuotes.find((item) => item.quote.id === quote.id) || scoreQuote(quote);
  const total = quoteEstimatedTotal(quote);
  const totalLabel = total ? quoteTotalLabel(quote) : "Price TBC";
  const statusClass = quote.status.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const badges = quoteDecisionBadges(score, decision);
  return `
    <article class="quote-card">
      <div class="quote-card-head">
        <div>
          <span>${escapeHtml(quote.category || "Product quote")}</span>
          <h3>${escapeHtml(quote.supplier)}</h3>
          <p>${escapeHtml(quote.brand)} ${escapeHtml(quote.sku)} - ${escapeHtml(quote.productName)}</p>
        </div>
        <strong class="quote-status ${escapeHtml(statusClass)}">${escapeHtml(quote.status)}</strong>
      </div>
      <div class="quote-score">
        <div>
          <span>Decision score</span>
          <strong>${score.score}</strong>
        </div>
        <div class="bar" aria-hidden="true"><i style="width:${score.score}%"></i></div>
      </div>
      <div class="decision-badges">${badges.map((badge) => `<span class="${escapeHtml(badge.type)}">${escapeHtml(badge.label)}</span>`).join("")}</div>
      <dl class="quote-facts">
        <div><dt>Unit price</dt><dd>${escapeHtml(quote.currency)} ${escapeHtml(quote.unitPrice || "TBC")}</dd></div>
        <div><dt>Quantity</dt><dd>${escapeHtml(quote.quantity || "TBC")}</dd></div>
        <div><dt>Total est.</dt><dd>${escapeHtml(totalLabel)}</dd></div>
        <div><dt>Lead time</dt><dd>${escapeHtml(quote.leadTime || "TBC")}</dd></div>
        <div><dt>Payment</dt><dd>${escapeHtml(quote.paymentTerms || "TBC")}</dd></div>
        <div><dt>Delivery</dt><dd>${escapeHtml(quote.deliveryTerms || "TBC")}</dd></div>
        <div><dt>Valid until</dt><dd>${escapeHtml(quote.validUntil || "TBC")}</dd></div>
      </dl>
      <p class="score-reason">${escapeHtml(score.reason)}</p>
      <p>${escapeHtml(quote.notes || "No supplier notes added.")}</p>
      <div class="quote-card-actions">
        <button type="button" data-load-quote="${escapeHtml(quote.id)}">Load</button>
        <button type="button" data-copy-quote-followup="${escapeHtml(quote.id)}">Copy follow-up</button>
        <button type="button" data-remove-quote="${escapeHtml(quote.id)}">Remove</button>
      </div>
    </article>
  `;
}

function quoteDecisionInsights() {
  const scoredQuotes = state.quotes.map(scoreQuote).sort((a, b) => b.score - a.score);
  const eligibleQuotes = scoredQuotes.filter((item) => item.quote.status !== "Rejected");
  const pricedQuotes = eligibleQuotes.filter((item) => item.priceTotal);
  const leadQuotes = eligibleQuotes.filter((item) => item.days);
  return {
    scoredQuotes,
    recommended: eligibleQuotes[0] || null,
    lowestPrice: pricedQuotes.sort((a, b) => a.priceTotal - b.priceTotal)[0] || null,
    fastestLead: leadQuotes.sort((a, b) => a.days - b.days)[0] || null
  };
}

function scoreQuote(quote) {
  let score = 48;
  const signals = [];
  const flags = [];
  const priceTotal = quoteEstimatedTotal(quote);
  const days = parseLeadTimeDays(quote.leadTime);
  const validity = quoteValidityStatus(quote.validUntil);
  const hasPayment = hasMeaningfulTerm(quote.paymentTerms);
  const hasDelivery = hasMeaningfulTerm(quote.deliveryTerms);

  if (quote.status === "Best option") {
    score += 18;
    signals.push("marked best option");
  } else if (quote.status === "Received") {
    score += 12;
    signals.push("received quote");
  } else if (quote.status === "Follow-up needed") {
    score -= 10;
    flags.push("follow-up needed");
  } else if (quote.status === "Requested") {
    score -= 8;
    flags.push("still requested");
  } else if (quote.status === "Rejected") {
    score -= 38;
    flags.push("rejected");
  }

  if (priceTotal) {
    score += 14;
    signals.push("priced");
  } else {
    score -= 18;
    flags.push("missing price or quantity");
  }

  if (days) {
    score += days <= 7 ? 12 : days <= 21 ? 7 : 3;
    signals.push("lead time available");
  } else {
    score -= 6;
    flags.push("lead time unclear");
  }

  if (hasPayment) {
    score += 5;
  } else {
    score -= 5;
    flags.push("payment terms missing");
  }

  if (hasDelivery) {
    score += 5;
  } else {
    score -= 5;
    flags.push("delivery terms missing");
  }

  if (validity === "healthy") {
    score += 5;
    signals.push("valid quote");
  } else if (validity === "risk") {
    score -= 10;
    flags.push("validity risk");
  } else {
    score -= 3;
    flags.push("validity missing");
  }

  if (quote.sourceUrl) {
    score += 3;
  }

  if (/stock|certificate|warranty|datasheet|origin/i.test(quote.notes || "")) {
    score += 3;
  }

  score = Math.max(0, Math.min(100, Math.round(score)));
  const reason = signals.length
    ? `Strengths: ${signals.slice(0, 3).join(", ")}.${flags.length ? ` Review: ${flags.slice(0, 3).join(", ")}.` : ""}`
    : `Needs review: ${flags.slice(0, 4).join(", ")}.`;

  return { quote, score, priceTotal, days, validity, flags, signals, reason };
}

function quoteDecisionBadges(scoredQuote, decision) {
  const badges = [];
  if (decision.recommended?.quote.id === scoredQuote.quote.id) {
    badges.push({ label: "Best current score", type: "best" });
  }
  if (decision.lowestPrice?.quote.id === scoredQuote.quote.id) {
    badges.push({ label: "Lowest price", type: "price" });
  }
  if (decision.fastestLead?.quote.id === scoredQuote.quote.id) {
    badges.push({ label: "Fastest lead", type: "speed" });
  }
  scoredQuote.flags.slice(0, 3).forEach((flag) => {
    badges.push({ label: flag, type: "risk" });
  });
  if (!badges.length) {
    badges.push({ label: "Ready for buyer review", type: "ready" });
  }
  return badges;
}

function quoteEstimatedTotal(quote) {
  const price = parseFirstNumber(quote.unitPrice);
  const quantity = parseFirstNumber(quote.quantity);
  if (!Number.isFinite(price) || !Number.isFinite(quantity)) {
    return 0;
  }
  return price * quantity;
}

function quoteTotalLabel(quote) {
  const total = quoteEstimatedTotal(quote);
  return total ? `${quote.currency} ${formatAmount(total)}` : "Price TBC";
}

function quoteTotalsByCurrency() {
  return state.quotes.reduce((totals, quote) => {
    const total = quoteEstimatedTotal(quote);
    if (!total) {
      return totals;
    }
    totals[quote.currency] = (totals[quote.currency] || 0) + total;
    return totals;
  }, {});
}

function parseFirstNumber(value) {
  const match = String(value || "").replace(/,/g, "").match(/\d+(\.\d+)?/);
  return match ? Number(match[0]) : NaN;
}

function parseLeadTimeDays(value) {
  const text = String(value || "").toLowerCase();
  const numbers = [...text.matchAll(/\d+(\.\d+)?/g)].map((match) => Number(match[0])).filter(Number.isFinite);
  if (!numbers.length) {
    return 0;
  }
  const average = numbers.length > 1 ? (numbers[0] + numbers[numbers.length - 1]) / 2 : numbers[0];
  if (/week/.test(text)) {
    return Math.round(average * 7);
  }
  if (/month/.test(text)) {
    return Math.round(average * 30);
  }
  return Math.round(average);
}

function quoteValidityStatus(value) {
  const raw = String(value || "").trim();
  if (!raw) {
    return "missing";
  }
  const date = new Date(`${raw}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return "missing";
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = Math.round((date - today) / 86400000);
  return days >= 7 ? "healthy" : "risk";
}

function hasMeaningfulTerm(value) {
  const term = String(value || "").trim().toLowerCase();
  return Boolean(term && !["tbc", "na", "n/a", "none", "unknown"].includes(term));
}

function formatAmount(value) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(value);
}

function quoteExportTable() {
  updateProjectFromFields();
  const decision = quoteDecisionInsights();
  const headers = [
    "Project Name",
    "Buyer / Company",
    "Buyer Contact",
    "Delivery Country",
    "Target Date",
    "Product",
    "Brand",
    "SKU",
    "Category",
    "Supplier",
    "Status",
    "Decision Score",
    "Decision Signals",
    "Review Flags",
    "Currency",
    "Unit Price",
    "Quantity",
    "Estimated Total",
    "Lead Time",
    "MOQ",
    "Payment Terms",
    "Delivery Terms",
    "Valid Until",
    "Source / Warranty URL",
    "Supplier Notes",
    "Saved At"
  ];
  const rows = state.quotes.map((quote) => {
    const scored = decision.scoredQuotes.find((item) => item.quote.id === quote.id) || scoreQuote(quote);
    return [
      projectValue("name", quote.projectName || ""),
      projectValue("buyer", quote.buyer || ""),
      projectValue("contact", quote.buyerContact || ""),
      projectValue("country", quote.deliveryCountry || ""),
      projectValue("targetDate", quote.targetDate || ""),
      quote.productName,
      quote.brand,
      quote.sku,
      quote.category,
      quote.supplier,
      quote.status,
      scored.score,
      scored.signals.join(" | "),
      scored.flags.join(" | "),
      quote.currency,
      quote.unitPrice,
      quote.quantity,
      quoteEstimatedTotal(quote) ? formatAmount(quoteEstimatedTotal(quote)) : "",
      quote.leadTime,
      quote.moq,
      quote.paymentTerms,
      quote.deliveryTerms,
      quote.validUntil,
      quote.sourceUrl,
      quote.notes,
      quote.savedAt
    ];
  });
  return { headers, rows };
}

async function copyQuoteSummary() {
  const table = quoteExportTable();
  const decision = quoteDecisionInsights();
  const text = table.rows.length
    ? `InduScout quote tracker summary
Prepared on ${formatCopyDate()}

Project: ${projectValue("name", "Unnamed sourcing project")}
Buyer/company: ${projectValue("buyer", "TBC")}
Delivery country: ${projectValue("country", "TBC")}
Target date: ${projectValue("targetDate", "TBC")}

Decision signals:
- Best current score: ${decision.recommended ? `${decision.recommended.quote.supplier} (${decision.recommended.score})` : "TBC"}
- Lowest price: ${decision.lowestPrice ? `${decision.lowestPrice.quote.supplier} - ${quoteTotalLabel(decision.lowestPrice.quote)}` : "TBC"}
- Fastest lead: ${decision.fastestLead ? `${decision.fastestLead.quote.supplier} - ${decision.fastestLead.days} days` : "TBC"}
- Quotes with review flags: ${decision.scoredQuotes.filter((item) => item.flags.length).length}

${state.quotes
        .map((quote, index) => {
          const scored = decision.scoredQuotes.find((item) => item.quote.id === quote.id) || scoreQuote(quote);
          return `${index + 1}. ${quote.supplier} - ${quote.brand} ${quote.sku}
Status: ${quote.status}
Decision score: ${scored.score}
Unit price: ${quote.currency} ${quote.unitPrice || "TBC"}
Quantity: ${quote.quantity || "TBC"}
Estimated total: ${quoteEstimatedTotal(quote) ? `${quote.currency} ${formatAmount(quoteEstimatedTotal(quote))}` : "TBC"}
Lead time: ${quote.leadTime || "TBC"}
Payment terms: ${quote.paymentTerms || "TBC"}
Delivery terms: ${quote.deliveryTerms || "TBC"}
Valid until: ${quote.validUntil || "TBC"}
Decision notes: ${scored.reason}
Notes: ${quote.notes || "None"}`;
        })
        .join("\n\n")}`
    : "No InduScout quote records saved yet.";

  try {
    await navigator.clipboard.writeText(text);
    els.copyQuoteSummary.textContent = "Summary copied";
    setTimeout(() => {
      els.copyQuoteSummary.textContent = "Copy quote summary";
    }, 1200);
  } catch {
    window.prompt("Copy quote summary", text);
  }
}

async function copyQuoteFollowupFromForm() {
  const quote = quoteFormSnapshot();
  await copyQuoteText(quoteFollowupText(quote), els.copyQuoteFollowup, "Follow-up copied", "Copy follow-up email");
}

async function copyQuoteFollowup(id, triggerButton) {
  const quote = state.quotes.find((item) => item.id === id);
  if (!quote) {
    return;
  }

  await copyQuoteText(quoteFollowupText(quote), triggerButton, "Follow-up copied", "Copy follow-up");
}

function quoteFollowupText(quote) {
  return `Subject: Follow-up - ${quote.brand} ${quote.sku} quote

Hello,

Thank you for your quotation. Please confirm the details below so we can complete buyer review.

Project: ${projectValue("name", quote.projectName || "Unnamed sourcing project")}
Buyer/company: ${projectValue("buyer", quote.buyer || "TBC")}
Delivery country: ${projectValue("country", quote.deliveryCountry || "TBC")}
Target date: ${projectValue("targetDate", quote.targetDate || "TBC")}

Product: ${quote.brand} ${quote.sku} - ${quote.productName}
Supplier: ${quote.supplier}
Quoted unit price: ${quote.currency} ${quote.unitPrice || "TBC"}
Quantity: ${quote.quantity || "TBC"}
Lead time: ${quote.leadTime || "TBC"}
MOQ: ${quote.moq || "TBC"}
Payment terms: ${quote.paymentTerms || "TBC"}
Delivery terms: ${quote.deliveryTerms || "TBC"}
Quote validity: ${quote.validUntil || "TBC"}

Please confirm:
- Exact part number and suffix/configuration.
- Stock availability and latest possible shipment date.
- Datasheet, certificate, warranty path, and country of origin.
- Final price, currency, payment terms, delivery terms, and quote validity.
- Whether any alternate offered is technically equivalent or only a suggested substitute.

Notes:
${quote.notes || "No extra notes added."}

InduScout is being used as a discovery and RFQ preparation aid. Final purchasing validation remains with the buyer and supplier.`;
}

async function copyQuoteText(text, triggerButton, copiedLabel, defaultLabel) {
  try {
    await navigator.clipboard.writeText(text);
    if (triggerButton) {
      triggerButton.textContent = copiedLabel;
      setTimeout(() => {
        triggerButton.textContent = defaultLabel;
      }, 1200);
    }
  } catch {
    window.prompt("Copy quote follow-up", text);
  }
}

function exportQuoteCsv() {
  const table = quoteExportTable();
  if (!table.rows.length) {
    els.exportQuoteCsv.textContent = "Add quotes first";
    setTimeout(() => {
      els.exportQuoteCsv.textContent = "Export CSV";
    }, 1200);
    return;
  }

  const csv = [table.headers, ...table.rows].map((row) => row.map(csvEscape).join(",")).join("\r\n");
  const projectSlug = safeFilenamePart(projectValue("name", ""));
  downloadFile(
    projectSlug
      ? `InduScout-Quote-Tracker-${projectSlug}-${new Date().toISOString().slice(0, 10)}.csv`
      : `InduScout-Quote-Tracker-${new Date().toISOString().slice(0, 10)}.csv`,
    `\ufeff${csv}`,
    "text/csv;charset=utf-8"
  );
}

function exportQuoteXlsx() {
  const table = quoteExportTable();
  if (!table.rows.length) {
    els.exportQuoteXlsx.textContent = "Add quotes first";
    setTimeout(() => {
      els.exportQuoteXlsx.textContent = "Export XLSX";
    }, 1200);
    return;
  }

  const projectSlug = safeFilenamePart(projectValue("name", ""));
  downloadFile(
    projectSlug
      ? `InduScout-Quote-Tracker-${projectSlug}-${new Date().toISOString().slice(0, 10)}.xlsx`
      : `InduScout-Quote-Tracker-${new Date().toISOString().slice(0, 10)}.xlsx`,
    createXlsxWorkbook(table.headers, table.rows, "Quotes", "InduScout Quote Tracker"),
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
}

function replyFieldValue(element, fallback = "") {
  const value = String(element?.value || "").trim();
  return value || fallback;
}

function selectedReplyContext(value = els.replyQuote?.value) {
  const raw = String(value || "");
  const separatorIndex = raw.indexOf(":");
  const type = separatorIndex >= 0 ? raw.slice(0, separatorIndex) : "product";
  const id = separatorIndex >= 0 ? raw.slice(separatorIndex + 1) : raw;

  if (type === "quote") {
    const quote = state.quotes.find((item) => item.id === id);
    const product = products.find((item) => item.id === quote?.productId) || products.find((item) => item.sku === quote?.sku) || products[0];
    if (quote || product) {
      return {
        itemRef: raw,
        type: "quote",
        quoteId: quote?.id || "",
        productId: product?.id || quote?.productId || "",
        product,
        quote,
        brand: quote?.brand || product?.brand || "",
        sku: quote?.sku || product?.sku || "",
        productName: quote?.productName || product?.name || "",
        category: quote?.category || product?.category || "",
        supplier: quote?.supplier || product?.sources[0]?.name || "",
        leadTime: quote?.leadTime || product?.lead || "",
        moq: quote?.moq || product?.moq || "",
        sourceUrl: quote?.sourceUrl || product?.sources[0]?.url || ""
      };
    }
  }

  const product = products.find((item) => item.id === id) || products[0];
  return {
    itemRef: product ? `product:${product.id}` : raw,
    type: "product",
    quoteId: "",
    productId: product?.id || "",
    product,
    quote: null,
    brand: product?.brand || "",
    sku: product?.sku || "",
    productName: product?.name || "",
    category: product?.category || "",
    supplier: product?.sources[0]?.name || "",
    leadTime: product?.lead || "",
    moq: product?.moq || "",
    sourceUrl: product?.sources[0]?.url || ""
  };
}

function replyFormSnapshot() {
  updateProjectFromFields();
  const context = selectedReplyContext();
  const existing = state.supplierReplies.find((reply) => reply.id === els.replyId?.value);
  const status = replyFieldValue(els.replyStatus, "Received");
  const supplier = replyFieldValue(els.replySupplier, context.supplier || "Supplier TBC");
  const subject = replyFieldValue(els.replySubject, `${context.brand} ${context.sku} supplier reply`.trim());
  return {
    id: replyFieldValue(els.replyId, `${Date.now()}-${safeFilenamePart(`${supplier}-${context.sku || "reply"}`).toLowerCase() || "reply"}`),
    savedAt: existing?.savedAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    projectName: projectValue("name", ""),
    buyer: projectValue("buyer", ""),
    buyerContact: projectValue("contact", ""),
    deliveryCountry: projectValue("country", ""),
    targetDate: projectValue("targetDate", ""),
    itemRef: context.itemRef,
    quoteId: context.quoteId,
    productId: context.productId,
    brand: context.brand,
    sku: context.sku,
    productName: context.productName,
    category: context.category,
    supplier,
    status,
    nextAction: replyFieldValue(els.replyAction, defaultReplyAction(status)),
    receivedDate: replyFieldValue(els.replyDate, new Date().toISOString().slice(0, 10)),
    subject,
    message: replyFieldValue(els.replyMessage, ""),
    notes: replyFieldValue(els.replyNotes, "")
  };
}

function hydrateSupplierReplyForm(reply = {}) {
  if (!els.replyQuote) {
    return;
  }

  populateReplyItems();
  const fallbackContext = selectedReplyContext();
  const itemRef = reply.itemRef || (reply.quoteId ? `quote:${reply.quoteId}` : reply.productId ? `product:${reply.productId}` : fallbackContext.itemRef);
  const hasOption = [...els.replyQuote.querySelectorAll("option")].some((option) => option.value === itemRef);

  els.replyId.value = reply.id || "";
  els.replyQuote.value = hasOption ? itemRef : fallbackContext.itemRef;
  els.replySupplier.value = reply.supplier || "";
  els.replyStatus.value = reply.status || "Received";
  els.replyAction.value = reply.nextAction || defaultReplyAction(reply.status || "Received");
  els.replyDate.value = reply.receivedDate || "";
  els.replySubject.value = reply.subject || "";
  els.replyMessage.value = reply.message || "";
  els.replyNotes.value = reply.notes || "";
}

function prefillReplyFromContext() {
  if (!els.replyQuote || els.replyId?.value) {
    return;
  }

  const context = selectedReplyContext();
  if (!els.replySupplier.value) {
    els.replySupplier.value = context.supplier || "";
  }
  if (!els.replySubject.value) {
    els.replySubject.value = `${context.brand} ${context.sku} - supplier reply`.trim();
  }
}

function saveSupplierReply() {
  if (!els.replyQuote) {
    return;
  }

  const reply = sanitizeSupplierReply(replyFormSnapshot());
  if (!reply) {
    return;
  }

  state.supplierReplies = [reply, ...state.supplierReplies.filter((item) => item.id !== reply.id)].slice(0, 120);
  saveSupplierReplies();
  hydrateSupplierReplyForm(reply);
  renderSupplierInbox();
  renderPlaybookLab();
  renderGovernanceCenter();
  els.saveReply.textContent = "Reply saved";
  setTimeout(() => {
    els.saveReply.textContent = "Save reply";
  }, 1200);
}

function clearSupplierReplyForm() {
  hydrateSupplierReplyForm();
  prefillReplyFromContext();
}

function clearSupplierReplies() {
  state.supplierReplies = [];
  saveSupplierReplies();
  clearSupplierReplyForm();
  renderSupplierInbox();
  renderPlaybookLab();
  renderGovernanceCenter();
}

function loadSupplierReply(id) {
  const reply = state.supplierReplies.find((item) => item.id === id);
  if (!reply) {
    return;
  }

  hydrateSupplierReplyForm(reply);
  els.replyForm?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function removeSupplierReply(id) {
  state.supplierReplies = state.supplierReplies.filter((reply) => reply.id !== id);
  saveSupplierReplies();
  renderSupplierInbox();
  renderPlaybookLab();
  renderGovernanceCenter();
}

function renderSupplierInbox() {
  if (!els.replyList || !els.inboxSummary) {
    return;
  }

  const total = state.supplierReplies.length;
  const needsAction = state.supplierReplies.filter(replyNeedsAction).length;
  const missingDocs = state.supplierReplies.filter((reply) => reply.status === "Missing certificate").length;
  const alternates = state.supplierReplies.filter((reply) => reply.status === "Alternate offered").length;
  const quoteReady = state.supplierReplies.filter(replyQuoteReady).length;

  els.inboxSummary.innerHTML = `
    <article><span>Total replies</span><strong>${total}</strong><small>Supplier messages saved locally</small></article>
    <article><span>Needs action</span><strong>${needsAction}</strong><small>Buyer response or supplier follow-up required</small></article>
    <article><span>Missing docs</span><strong>${missingDocs}</strong><small>Certificate, datasheet, or evidence gaps</small></article>
    <article><span>Alternates</span><strong>${alternates}</strong><small>Substitutes needing technical review</small></article>
    <article><span>Quote ready</span><strong>${quoteReady}</strong><small>Can update the quote tracker</small></article>
  `;

  if (els.replyRegisterStatus) {
    els.replyRegisterStatus.textContent = total ? `${total} saved supplier ${total === 1 ? "reply" : "replies"} in this browser` : "Stored locally in this browser";
  }

  if (!total) {
    els.replyList.innerHTML = `
      <div class="empty-state inbox-empty">
        Save supplier email or portal replies here. Use it to prepare the next buyer response before updating the quote tracker.
      </div>
    `;
    renderBuyerWorkspace();
    renderEvidenceReviewBoard();
    renderSupplierScorecard();
    return;
  }

  els.replyList.innerHTML = state.supplierReplies.map(replyCardTemplate).join("");
  renderBuyerWorkspace();
  renderEvidenceReviewBoard();
  renderSupplierScorecard();
}

function renderSupplierScorecard() {
  if (!els.supplierScoreStats || !els.supplierScoreTitle || !els.supplierScoreGrid) {
    return;
  }

  const scorecard = supplierScorecardData();
  els.supplierScoreStats.innerHTML = [
    scorecardStatTemplate("Supplier paths", scorecard.cards.length, "Quotes, replies, sources, and leads"),
    scorecardStatTemplate("Top path", scorecard.top ? scorecard.top.name : "TBC", scorecard.top ? `${scorecard.top.score}% - ${scorecard.top.statusLabel}` : "Add shortlist or quote data"),
    scorecardStatTemplate("Follow-ups", scorecard.followUps, scorecard.followUps ? "Need supplier or buyer action" : "No open supplier actions"),
    scorecardStatTemplate("Review risks", scorecard.riskCount, scorecard.riskCount ? "Visible supplier path risks" : "No major supplier path risks")
  ].join("");

  els.supplierScoreTitle.textContent = scorecard.title;

  if (!scorecard.cards.length) {
    els.supplierScoreGrid.innerHTML = `
      <div class="empty-state scorecard-empty">
        Add shortlist items, supplier quotes, supplier replies, or source leads to generate supplier path ranking.
      </div>
    `;
    return;
  }

  els.supplierScoreGrid.innerHTML = scorecard.cards.map(supplierScorecardTemplate).join("");
}

function supplierScorecardData() {
  const paths = new Map();
  const selectedProducts = [...new Set([...state.shortlist, ...state.compare])]
    .map((id) => products.find((product) => product.id === id))
    .filter(Boolean);

  const ensurePath = (name) => {
    const supplierName = String(name || "").trim();
    if (!supplierName || supplierName === "Supplier TBC") {
      return null;
    }
    const key = supplierKey(supplierName);
    if (!key) {
      return null;
    }
    if (!paths.has(key)) {
      paths.set(key, {
        key,
        name: supplierName,
        quotes: [],
        replies: [],
        sources: [],
        sourceLeads: [],
        products: new Map()
      });
    }
    return paths.get(key);
  };

  const addProduct = (path, product) => {
    if (path && product) {
      path.products.set(product.id, product);
    }
  };

  state.quotes.forEach((quote) => {
    const path = ensurePath(quote.supplier);
    if (!path) {
      return;
    }
    path.quotes.push(quote);
    addProduct(path, products.find((product) => product.id === quote.productId));
  });

  state.supplierReplies.forEach((reply) => {
    const path = ensurePath(reply.supplier);
    if (!path) {
      return;
    }
    path.replies.push(reply);
    addProduct(path, products.find((product) => product.id === reply.productId));
  });

  selectedProducts.forEach((product) => {
    product.sources.forEach((source) => {
      const path = ensurePath(source.name);
      if (!path) {
        return;
      }
      path.sources.push({ source, product });
      addProduct(path, product);
    });
  });

  state.sourceLeads.forEach((lead) => {
    const path = ensurePath(lead.name);
    if (!path) {
      return;
    }
    path.sourceLeads.push(lead);
  });

  const cards = [...paths.values()]
    .map(scoreSupplierPath)
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
    .slice(0, 12);
  const top = cards[0] || null;
  const followUps = cards.reduce((total, card) => total + card.followUps, 0);
  const riskCount = cards.filter((card) => card.risks.length).length;
  const title = top ? `${top.name} leads supplier ranking` : "Supplier scorecard needs sourcing data";

  return { cards, top, followUps, riskCount, title };
}

function scoreSupplierPath(path) {
  const scoredQuotes = path.quotes.map(scoreQuote).sort((a, b) => b.score - a.score);
  const bestQuote = scoredQuotes[0] || null;
  const receivedQuotes = path.quotes.filter((quote) => ["Received", "Best option"].includes(quote.status));
  const bestOptions = path.quotes.filter((quote) => quote.status === "Best option");
  const pricedQuotes = scoredQuotes.filter((item) => item.priceTotal);
  const healthyValidity = path.quotes.some((quote) => quoteValidityStatus(quote.validUntil) === "healthy");
  const paymentTerms = path.quotes.some((quote) => hasMeaningfulTerm(quote.paymentTerms));
  const deliveryTerms = path.quotes.some((quote) => hasMeaningfulTerm(quote.deliveryTerms));
  const sourceUrls = path.quotes.filter((quote) => quote.sourceUrl).length;
  const replyActions = path.replies.filter(replyNeedsAction);
  const missingDocs = path.replies.filter((reply) => reply.status === "Missing certificate");
  const alternates = path.replies.filter((reply) => reply.status === "Alternate offered");
  const evidenceLeads = path.sourceLeads.filter((lead) => lead.website || lead.evidenceUrl);
  const provenLeads = path.sourceLeads.filter((lead) => ["Buyer proven", "Authorized claim", "Evidence supplied"].includes(lead.status));
  const sourceTypes = [...new Set([
    ...path.sources.map((item) => item.source.type),
    ...path.sourceLeads.map((lead) => lead.type)
  ])];
  const hasPrimaryPath = sourceTypes.some((type) => ["OEM", "Distributor", "MRO"].includes(type));
  const hasHigherRiskPath = sourceTypes.some((type) => ["Marketplace", "Surplus"].includes(type));

  let score = 42;
  if (path.quotes.length) {
    score += Math.min(18, path.quotes.length * 6);
  }
  if (receivedQuotes.length) {
    score += 12;
  }
  if (bestOptions.length) {
    score += 10;
  }
  if (bestQuote) {
    score += Math.round((bestQuote.score - 50) * 0.25);
  }
  if (pricedQuotes.length) {
    score += 6;
  }
  if (paymentTerms) {
    score += 4;
  }
  if (deliveryTerms) {
    score += 4;
  }
  if (healthyValidity) {
    score += 4;
  }
  if (sourceUrls || evidenceLeads.length) {
    score += 5;
  }
  if (path.replies.length) {
    score += 4;
  }
  if (provenLeads.length) {
    score += 7;
  }
  if (hasPrimaryPath) {
    score += 7;
  }
  if (hasHigherRiskPath) {
    score -= 5;
  }
  if (replyActions.length) {
    score -= Math.min(18, replyActions.length * 6);
  }
  if (missingDocs.length) {
    score -= 10;
  }
  if (alternates.length) {
    score -= 5;
  }
  if (!path.quotes.length) {
    score -= 12;
  }

  score = Math.max(0, Math.min(100, Math.round(score)));

  const strengths = [];
  const risks = [];

  if (bestOptions.length) {
    strengths.push("Marked as best option in quote tracker");
  } else if (receivedQuotes.length) {
    strengths.push(`${receivedQuotes.length} received quote ${receivedQuotes.length === 1 ? "record" : "records"}`);
  }
  if (pricedQuotes.length) {
    strengths.push("Comparable price and quantity captured");
  }
  if (paymentTerms && deliveryTerms) {
    strengths.push("Payment and delivery terms captured");
  }
  if (healthyValidity) {
    strengths.push("Quote validity date is usable");
  }
  if (hasPrimaryPath) {
    strengths.push(`Primary source path present: ${sourceTypes.filter((type) => ["OEM", "Distributor", "MRO"].includes(type)).join(", ")}`);
  }
  if (provenLeads.length) {
    strengths.push("Source lead has buyer/evidence signal");
  }
  if (!strengths.length) {
    strengths.push("Supplier path is visible but needs more commercial evidence");
  }

  if (!path.quotes.length) {
    risks.push("No saved quote record");
  }
  if (path.quotes.length && !pricedQuotes.length) {
    risks.push("No comparable price captured");
  }
  if (path.quotes.length && (!paymentTerms || !deliveryTerms)) {
    risks.push("Payment or delivery terms still TBC");
  }
  if (path.quotes.length && !healthyValidity) {
    risks.push("Quote validity missing or near expiry");
  }
  if (replyActions.length) {
    risks.push(`${replyActions.length} supplier reply ${replyActions.length === 1 ? "action" : "actions"} still open`);
  }
  if (missingDocs.length) {
    risks.push("Certificate or document evidence missing");
  }
  if (alternates.length) {
    risks.push("Alternate offer needs technical review");
  }
  if (hasHigherRiskPath) {
    risks.push("Marketplace or surplus path needs extra legitimacy checks");
  }

  const statusLabel = score >= 85
    ? "Preferred supplier path"
    : score >= 70
      ? "Strong with checks"
      : score >= 55
        ? "Needs follow-up"
        : "High review risk";
  const statusClass = score >= 85 ? "preferred" : score >= 70 ? "strong" : score >= 55 ? "review" : "risk";
  const nextAction = supplierNextAction({ path, risks, score, bestQuote, replyActions });
  const totalValue = path.quotes.reduce((total, quote) => total + quoteEstimatedTotal(quote), 0);
  const currencies = [...new Set(path.quotes.map((quote) => quote.currency).filter(Boolean))];
  const valueLabel = totalValue ? `${currencies[0] || "USD"} ${formatAmount(totalValue)}` : "Value TBC";

  return {
    name: path.name,
    score,
    statusLabel,
    statusClass,
    quotes: path.quotes.length,
    replies: path.replies.length,
    followUps: replyActions.length,
    products: [...path.products.values()],
    sourceTypes,
    sourceLeads: path.sourceLeads.length,
    bestQuote: bestQuote?.quote || null,
    valueLabel,
    strengths: strengths.slice(0, 5),
    risks: risks.slice(0, 6),
    nextAction
  };
}

function supplierNextAction({ path, risks, score, bestQuote, replyActions }) {
  if (!path.quotes.length) {
    return "Request a formal quote with price, lead time, validity, payment terms, delivery terms, warranty path, and certificate evidence.";
  }
  if (replyActions.length) {
    return "Close open supplier replies before award: certificates, alternates, revised price, lead time, and stock confirmation.";
  }
  if (risks.length) {
    return `Resolve before award: ${risks.slice(0, 2).join("; ")}.`;
  }
  if (score >= 85 && bestQuote) {
    return "Use this path as the current award candidate, then complete compliance and buyer file attachments.";
  }
  return "Keep as a viable supplier path while comparing commercial terms and final due-diligence evidence.";
}

function supplierKey(value) {
  return String(value || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function scorecardStatTemplate(label, value, detail) {
  return `
    <article class="scorecard-stat">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
      <small>${escapeHtml(detail)}</small>
    </article>
  `;
}

function supplierScorecardTemplate(card, index) {
  const productsLabel = card.products.length
    ? card.products.slice(0, 4).map((product) => `${product.brand} ${product.sku}`).join(", ")
    : "No linked products yet";
  const sourceLabel = card.sourceTypes.length ? card.sourceTypes.join(", ") : "Source type TBC";
  return `
    <article class="scorecard-item ${escapeHtml(card.statusClass)}">
      <div class="scorecard-rank">
        <span>#${index + 1}</span>
        <strong>${escapeHtml(card.name)}</strong>
        <small>${escapeHtml(card.statusLabel)}</small>
      </div>
      <div class="scorecard-score">
        <span>Supplier score</span>
        <strong>${card.score}</strong>
        <div class="bar" aria-hidden="true"><i style="width:${card.score}%"></i></div>
      </div>
      <dl class="scorecard-facts">
        <div><dt>Quotes</dt><dd>${card.quotes}</dd></div>
        <div><dt>Replies</dt><dd>${card.replies}</dd></div>
        <div><dt>Open actions</dt><dd>${card.followUps}</dd></div>
        <div><dt>Value</dt><dd>${escapeHtml(card.valueLabel)}</dd></div>
        <div><dt>Source type</dt><dd>${escapeHtml(sourceLabel)}</dd></div>
        <div><dt>Products</dt><dd>${escapeHtml(productsLabel)}</dd></div>
      </dl>
      <div class="scorecard-columns">
        <div>
          <span>Strengths</span>
          <ul>${card.strengths.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        </div>
        <div>
          <span>Risks / checks</span>
          <ul>${card.risks.length ? card.risks.map((item) => `<li>${escapeHtml(item)}</li>`).join("") : "<li>No major open risk visible from current session data.</li>"}</ul>
        </div>
      </div>
      <p class="scorecard-next"><strong>Next action:</strong> ${escapeHtml(card.nextAction)}</p>
    </article>
  `;
}

function supplierScorecardText() {
  const scorecard = supplierScorecardData();
  const rows = scorecard.cards.map((card, index) => `#${index + 1} ${card.name} - ${card.score}% (${card.statusLabel})
Products: ${card.products.length ? card.products.map((product) => `${product.brand} ${product.sku}`).join(", ") : "TBC"}
Quotes: ${card.quotes} | Replies: ${card.replies} | Open actions: ${card.followUps} | Value: ${card.valueLabel}
Source types: ${card.sourceTypes.join(", ") || "TBC"}
Strengths:
${card.strengths.map((item) => `- ${item}`).join("\n")}
Risks / checks:
${card.risks.length ? card.risks.map((item) => `- ${item}`).join("\n") : "- No major open risk visible from current session data."}
Next action: ${card.nextAction}`).join("\n\n");

  return `InduScout supplier scorecard
Prepared on ${formatCopyDate()}

Project: ${projectValue("name", "TBC")}
Buyer/company: ${projectValue("buyer", "TBC")}
Delivery country: ${projectValue("country", "TBC")}
Target date: ${projectValue("targetDate", "TBC")}

Summary:
- Supplier paths reviewed: ${scorecard.cards.length}
- Top path: ${scorecard.top ? `${scorecard.top.name} (${scorecard.top.score}%)` : "TBC"}
- Follow-ups open: ${scorecard.followUps}
- Supplier paths with risks: ${scorecard.riskCount}

Supplier ranking:
${rows || "No supplier paths available yet. Add shortlist items, quotes, supplier replies, or source leads."}

Buyer reminder:
Treat this as a sourcing decision aid. Confirm exact part number, stock, price, lead time, payment terms, delivery terms, warranty path, certificates, country of origin, and seller legitimacy before purchase or award.`;
}

function supplierScorecardSnapshot() {
  const scorecard = supplierScorecardData();
  return {
    ...createSessionSnapshot(),
    supplierScorecard: {
      generatedAt: new Date().toISOString(),
      project: state.project,
      topSupplier: scorecard.top,
      followUps: scorecard.followUps,
      riskCount: scorecard.riskCount,
      suppliers: scorecard.cards,
      generatedText: supplierScorecardText()
    }
  };
}

async function copySupplierScorecard() {
  updateProjectFromFields();
  const text = supplierScorecardText();
  try {
    await navigator.clipboard.writeText(text);
    if (els.copySupplierScorecard) {
      els.copySupplierScorecard.textContent = "Scorecard copied";
      setTimeout(() => {
        els.copySupplierScorecard.textContent = "Copy scorecard";
      }, 1400);
    }
  } catch {
    window.prompt("Copy supplier scorecard", text);
  }
  renderSupplierScorecard();
}

function downloadSupplierScorecardHtml() {
  updateProjectFromFields();
  const projectSlug = safeFilenamePart(projectValue("name", ""));
  const date = new Date().toISOString().slice(0, 10);
  const filename = `InduScout-Supplier-Scorecard${projectSlug ? `-${projectSlug}` : ""}-${date}.html`;
  downloadFile(filename, supplierScorecardHtml(), "text/html;charset=utf-8");
  renderSupplierScorecard();
}

function exportSupplierScorecardJson() {
  updateProjectFromFields();
  const projectSlug = safeFilenamePart(projectValue("name", ""));
  const date = new Date().toISOString().slice(0, 10);
  const filename = projectSlug ? `InduScout-Supplier-Scorecard-${projectSlug}-${date}.json` : `InduScout-Supplier-Scorecard-${date}.json`;
  downloadFile(filename, JSON.stringify(supplierScorecardSnapshot(), null, 2), "application/json;charset=utf-8");
  renderSupplierScorecard();
}

function supplierScorecardHtml() {
  const scorecard = supplierScorecardData();
  const text = supplierScorecardText();
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>InduScout Supplier Scorecard</title>
  <style>
    :root { color-scheme: light; }
    body { margin: 0; font-family: Arial, Helvetica, sans-serif; color: #0f172a; background: #eef6f8; }
    main { max-width: 980px; margin: 0 auto; padding: 32px; }
    header, section { background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; margin-bottom: 14px; padding: 20px; }
    h1 { margin: 6px 0 10px; font-size: 32px; line-height: 1.05; }
    p, pre { font-size: 13px; line-height: 1.55; }
    pre { white-space: pre-wrap; font-family: Arial, Helvetica, sans-serif; margin: 0; }
    .eyebrow { color: #00766f; font-size: 12px; font-weight: 800; text-transform: uppercase; }
    .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin: 14px 0; }
    .stat { border: 1px solid #dbe7ef; border-radius: 8px; padding: 12px; }
    .stat span { display: block; color: #64748b; font-size: 11px; font-weight: 800; text-transform: uppercase; }
    .stat strong { display: block; margin-top: 6px; font-size: 22px; }
    button { background: #0f172a; color: #ffffff; border: 0; border-radius: 6px; padding: 10px 14px; font-weight: 800; }
    @media print { body { background: #ffffff; } main { padding: 0; } button { display: none; } header, section { break-inside: avoid; } }
  </style>
</head>
<body>
  <main>
    <header>
      <div class="eyebrow">InduScout supplier scorecard</div>
      <h1>${escapeHtml(scorecard.title)}</h1>
      <p>Prepared on ${escapeHtml(formatCopyDate())}. Use this as a buyer review aid for supplier path ranking and follow-up planning.</p>
      <button onclick="window.print()">Save as PDF</button>
    </header>
    <div class="stats">
      <div class="stat"><span>Supplier paths</span><strong>${escapeHtml(scorecard.cards.length)}</strong></div>
      <div class="stat"><span>Top path</span><strong>${escapeHtml(scorecard.top ? scorecard.top.name : "TBC")}</strong></div>
      <div class="stat"><span>Follow-ups</span><strong>${escapeHtml(scorecard.followUps)}</strong></div>
      <div class="stat"><span>Risks</span><strong>${escapeHtml(scorecard.riskCount)}</strong></div>
    </div>
    <section>
      <pre>${escapeHtml(text)}</pre>
    </section>
  </main>
</body>
</html>`;
}

function replyCardTemplate(reply) {
  const statusClass = reply.status.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const contextLabel = `${reply.brand} ${reply.sku} - ${reply.productName}`.trim();
  return `
    <article class="reply-card">
      <div class="reply-card-head">
        <div>
          <span>${escapeHtml(reply.category || "Supplier thread")}</span>
          <h3>${escapeHtml(reply.supplier)}</h3>
          <p>${escapeHtml(contextLabel || reply.subject || "Supplier reply")}</p>
        </div>
        <strong class="reply-status ${escapeHtml(statusClass)}">${escapeHtml(reply.status)}</strong>
      </div>
      <dl class="reply-facts">
        <div><dt>Next action</dt><dd>${escapeHtml(reply.nextAction)}</dd></div>
        <div><dt>Reply date</dt><dd>${escapeHtml(reply.receivedDate || "TBC")}</dd></div>
        <div><dt>Subject</dt><dd>${escapeHtml(reply.subject || "TBC")}</dd></div>
        <div><dt>Quote link</dt><dd>${reply.quoteId ? "Linked" : "Not linked"}</dd></div>
      </dl>
      <p>${escapeHtml(reply.message || "No supplier message pasted yet.")}</p>
      <p class="score-reason">${escapeHtml(reply.notes || "No buyer notes added.")}</p>
      <div class="reply-card-actions">
        <button type="button" data-load-reply="${escapeHtml(reply.id)}">Load</button>
        <button type="button" data-copy-buyer-reply="${escapeHtml(reply.id)}">Copy buyer reply</button>
        <button type="button" data-convert-reply="${escapeHtml(reply.id)}">Convert to quote</button>
        <button type="button" data-remove-reply="${escapeHtml(reply.id)}">Remove</button>
      </div>
    </article>
  `;
}

function replyNeedsAction(reply) {
  return reply.status !== "Closed" && reply.nextAction !== "Close thread";
}

function replyQuoteReady(reply) {
  return ["Received", "Price revised"].includes(reply.status) || reply.nextAction === "Update quote tracker";
}

function defaultReplyAction(status) {
  if (status === "Missing certificate") {
    return "Ask for datasheet / certificate";
  }
  if (status === "Alternate offered") {
    return "Review alternate";
  }
  if (status === "Price revised" || status === "Received") {
    return "Update quote tracker";
  }
  if (status === "Closed") {
    return "Close thread";
  }
  return "Confirm stock and lead time";
}

async function copyBuyerReplyFromForm() {
  const reply = sanitizeSupplierReply(replyFormSnapshot());
  if (!reply) {
    return;
  }
  await copyReplyText(buyerReplyText(reply), els.copyBuyerReply, "Buyer reply copied", "Copy buyer reply");
}

async function copyBuyerReply(id, triggerButton) {
  const reply = state.supplierReplies.find((item) => item.id === id);
  if (!reply) {
    return;
  }
  await copyReplyText(buyerReplyText(reply), triggerButton, "Buyer reply copied", "Copy buyer reply");
}

function buyerReplyText(reply) {
  const requestLines = replyRequestChecklist(reply);
  return `Subject: Re: ${reply.subject || `${reply.brand} ${reply.sku} sourcing`}${reply.subject ? "" : ""}

Hello ${reply.supplier},

Thank you for your update. We are reviewing the item below for buyer approval.

Project: ${projectValue("name", reply.projectName || "Unnamed sourcing project")}
Buyer/company: ${projectValue("buyer", reply.buyer || "TBC")}
Delivery country: ${projectValue("country", reply.deliveryCountry || "TBC")}
Target date: ${projectValue("targetDate", reply.targetDate || "TBC")}

Product: ${reply.brand} ${reply.sku} - ${reply.productName}
Current reply status: ${reply.status}
Next action: ${reply.nextAction}

Please confirm:
${requestLines.map((line) => `- ${line}`).join("\n")}

Supplier message captured:
${reply.message || "No supplier message pasted."}

Buyer notes:
${reply.notes || "No additional buyer notes."}

Once confirmed, we can update the quote tracker and proceed with internal review.

InduScout is being used as a discovery and RFQ preparation aid. Final purchasing validation remains with the buyer and supplier.`;
}

function replyRequestChecklist(reply) {
  if (reply.status === "Missing certificate" || reply.nextAction === "Ask for datasheet / certificate") {
    return [
      "Latest datasheet and applicable certificate copies.",
      "Warranty path, country of origin, and authorized supply route.",
      "Whether the certificate applies to the exact suffix/configuration offered."
    ];
  }
  if (reply.status === "Alternate offered" || reply.nextAction === "Review alternate") {
    return [
      "Exact alternate part number and manufacturer.",
      "Technical equivalence against the requested part, including differences.",
      "Datasheet, certifications, lead time, and warranty path for the alternate."
    ];
  }
  if (reply.status === "Price revised" || reply.nextAction === "Request revised quote") {
    return [
      "Final unit price, currency, validity, and any quantity breaks.",
      "Stock availability, dispatch date, lead time, and delivery terms.",
      "Payment terms, warranty path, and whether the price includes all applicable charges."
    ];
  }
  return [
    "Exact part number and suffix/configuration.",
    "Current stock, lead time, MOQ, and quote validity.",
    "Datasheet, certificate, warranty path, country of origin, and seller legitimacy."
  ];
}

async function copyReplyText(text, triggerButton, copiedLabel, defaultLabel) {
  try {
    await navigator.clipboard.writeText(text);
    if (triggerButton) {
      triggerButton.textContent = copiedLabel;
      setTimeout(() => {
        triggerButton.textContent = defaultLabel;
      }, 1200);
    }
  } catch {
    window.prompt("Copy buyer reply", text);
  }
}

function convertReplyToQuote(replyOrId, triggerButton) {
  const rawReply = typeof replyOrId === "string" ? state.supplierReplies.find((item) => item.id === replyOrId) : replyOrId;
  const reply = sanitizeSupplierReply(rawReply);
  if (!reply) {
    return;
  }

  const context = selectedReplyContext(reply.itemRef || (reply.quoteId ? `quote:${reply.quoteId}` : `product:${reply.productId}`));
  const existing = state.quotes.find((quote) => quote.id === reply.quoteId);
  const notes = [
    existing?.notes,
    `Inbox reply ${reply.receivedDate || new Date().toISOString().slice(0, 10)}: ${reply.status}. ${reply.nextAction}. ${reply.message || ""} ${reply.notes || ""}`.trim()
  ].filter(Boolean).join("\n\n");
  const quote = sanitizeQuoteRecord({
    ...existing,
    id: existing?.id || `${Date.now()}-${safeFilenamePart(`${reply.supplier}-${context.sku || "quote"}`).toLowerCase() || "quote"}`,
    savedAt: existing?.savedAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    projectName: projectValue("name", reply.projectName || ""),
    buyer: projectValue("buyer", reply.buyer || ""),
    buyerContact: projectValue("contact", reply.buyerContact || ""),
    deliveryCountry: projectValue("country", reply.deliveryCountry || ""),
    targetDate: projectValue("targetDate", reply.targetDate || ""),
    productId: context.productId,
    brand: context.brand,
    sku: context.sku,
    productName: context.productName,
    category: context.category,
    supplier: reply.supplier,
    status: replyQuoteReady(reply) ? "Received" : "Follow-up needed",
    currency: existing?.currency || "USD",
    unitPrice: existing?.unitPrice || "",
    quantity: existing?.quantity || defaultQuantity(context.product?.moq || ""),
    leadTime: existing?.leadTime || context.leadTime,
    moq: existing?.moq || context.moq,
    paymentTerms: existing?.paymentTerms || "TBC",
    deliveryTerms: existing?.deliveryTerms || "TBC",
    validUntil: existing?.validUntil || "",
    sourceUrl: existing?.sourceUrl || context.sourceUrl,
    notes
  });

  if (!quote) {
    return;
  }

  state.quotes = [quote, ...state.quotes.filter((item) => item.id !== quote.id)].slice(0, 80);
  saveQuoteRecords();
  hydrateQuoteForm(quote);
  renderQuoteTracker();
  renderPlaybookLab();
  populateReplyItems();

  const linkedReply = { ...reply, quoteId: quote.id, itemRef: `quote:${quote.id}`, updatedAt: new Date().toISOString() };
  state.supplierReplies = [linkedReply, ...state.supplierReplies.filter((item) => item.id !== linkedReply.id)].slice(0, 120);
  saveSupplierReplies();
  hydrateSupplierReplyForm(linkedReply);
  renderSupplierInbox();
  renderPlaybookLab();

  if (triggerButton) {
    triggerButton.textContent = "Quote updated";
    setTimeout(() => {
      triggerButton.textContent = "Convert to quote";
    }, 1200);
  }
}

function supplierReplyExportTable() {
  updateProjectFromFields();
  const headers = [
    "Project Name",
    "Buyer / Company",
    "Buyer Contact",
    "Delivery Country",
    "Target Date",
    "Product",
    "Brand",
    "SKU",
    "Category",
    "Supplier",
    "Reply Status",
    "Next Action",
    "Received Date",
    "Subject",
    "Supplier Message",
    "Buyer Notes",
    "Linked Quote",
    "Saved At"
  ];
  const rows = state.supplierReplies.map((reply) => [
    projectValue("name", reply.projectName || ""),
    projectValue("buyer", reply.buyer || ""),
    projectValue("contact", reply.buyerContact || ""),
    projectValue("country", reply.deliveryCountry || ""),
    projectValue("targetDate", reply.targetDate || ""),
    reply.productName,
    reply.brand,
    reply.sku,
    reply.category,
    reply.supplier,
    reply.status,
    reply.nextAction,
    reply.receivedDate,
    reply.subject,
    reply.message,
    reply.notes,
    reply.quoteId ? "Yes" : "No",
    reply.savedAt
  ]);
  return { headers, rows };
}

function exportSupplierReplyCsv() {
  const table = supplierReplyExportTable();
  if (!table.rows.length) {
    els.exportReplyCsv.textContent = "Add replies first";
    setTimeout(() => {
      els.exportReplyCsv.textContent = "Export CSV";
    }, 1200);
    return;
  }

  const csv = [table.headers, ...table.rows].map((row) => row.map(csvEscape).join(",")).join("\r\n");
  const projectSlug = safeFilenamePart(projectValue("name", ""));
  downloadFile(
    projectSlug
      ? `InduScout-Supplier-Inbox-${projectSlug}-${new Date().toISOString().slice(0, 10)}.csv`
      : `InduScout-Supplier-Inbox-${new Date().toISOString().slice(0, 10)}.csv`,
    `\ufeff${csv}`,
    "text/csv;charset=utf-8"
  );
}

function exportSupplierReplyXlsx() {
  const table = supplierReplyExportTable();
  if (!table.rows.length) {
    els.exportReplyXlsx.textContent = "Add replies first";
    setTimeout(() => {
      els.exportReplyXlsx.textContent = "Export XLSX";
    }, 1200);
    return;
  }

  const projectSlug = safeFilenamePart(projectValue("name", ""));
  downloadFile(
    projectSlug
      ? `InduScout-Supplier-Inbox-${projectSlug}-${new Date().toISOString().slice(0, 10)}.xlsx`
      : `InduScout-Supplier-Inbox-${new Date().toISOString().slice(0, 10)}.xlsx`,
    createXlsxWorkbook(table.headers, table.rows, "Supplier Inbox", "InduScout Supplier Inbox"),
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
}

function removeFromShortlist(id) {
  state.shortlist = state.shortlist.filter((item) => item !== id);
  renderShortlist();
  render();
}

function toggleShortlist(id) {
  if (state.shortlist.includes(id)) {
    state.shortlist = state.shortlist.filter((item) => item !== id);
  } else {
    state.shortlist.push(id);
  }
  renderShortlist();
  render();
}

function renderShortlist() {
  const selected = state.shortlist.map((id) => products.find((product) => product.id === id)).filter(Boolean);
  updateShortlistControls(selected);
  renderShortlistProjectSummary();

  if (!selected.length) {
    els.shortlistItems.innerHTML = '<div class="empty-state">Your shortlist is empty. Add products from the finder to draft an RFQ.</div>';
    return;
  }

  els.shortlistItems.innerHTML = selected
    .map(
      (product) => `
        <article class="shortlist-item">
          <h3>${escapeHtml(product.name)}</h3>
          <p>${escapeHtml(product.brand)} &middot; ${escapeHtml(product.sku)}</p>
          <p>Alternatives: ${escapeHtml(product.alternatives.join(", "))}</p>
          <button type="button" data-remove="${escapeHtml(product.id)}">Remove</button>
        </article>
      `
    )
    .join("");

  els.shortlistItems.querySelectorAll("[data-remove]").forEach((button) => {
    button.addEventListener("click", () => removeFromShortlist(button.dataset.remove));
  });
}

function updateShortlistControls(selected = state.shortlist.map((id) => products.find((product) => product.id === id)).filter(Boolean)) {
  const count = selected.length;
  els.shortlistCount.textContent = count;
  els.exportShortlist.textContent = count ? `Export shortlist (${count})` : "Export shortlist";
  els.shortlistToggle.setAttribute("aria-label", count ? `Open shortlist with ${count} ${count === 1 ? "item" : "items"}` : "Open shortlist");
}

function defaultFilters() {
  return {
    query: "",
    category: "all",
    region: "all",
    sourceType: "all",
    confidence: "all",
    priority: "balanced",
    datasheetOnly: false,
    verifiedOnly: false
  };
}

function createSessionSnapshot() {
  updateProjectFromFields();
  if (els.specForm) {
    state.specRequirements = specRequirementsFromFields();
  }
  if (els.alternateForm) {
    state.alternateReview = alternateReviewFromFields();
  }
  if (els.approvalForm) {
    state.substitutionApproval = substitutionApprovalFromFields();
  }
  if (els.costForm) {
    state.landedCost = landedCostFromFields();
  }
  if (els.negotiationForm) {
    state.negotiationPlan = negotiationFromFields();
  }
  return {
    app: "InduScout",
    version: "6.1",
    savedAt: new Date().toISOString(),
    project: state.project,
    specRequirements: state.specRequirements,
    alternateReview: state.alternateReview,
    substitutionApproval: state.substitutionApproval,
    landedCost: state.landedCost,
    negotiationPlan: state.negotiationPlan,
    playbookConfig: state.playbookConfig,
    filters: {
      query: state.query,
      category: state.category,
      region: state.region,
      sourceType: state.sourceType,
      confidence: state.confidence,
      priority: state.priority,
      datasheetOnly: state.datasheetOnly,
      verifiedOnly: state.verifiedOnly
    },
    shortlist: state.shortlist.filter((id) => products.some((product) => product.id === id)),
    compare: state.compare.filter((id) => products.some((product) => product.id === id)),
    notes: Object.fromEntries(
      Object.entries(state.notes).filter(([id, note]) => products.some((product) => product.id === id) && String(note).trim())
    ),
    productRequests: state.productRequests,
    sourceLeads: state.sourceLeads,
    launchPartners: state.launchPartners,
    pilotRuns: state.pilotRuns,
    quotes: state.quotes,
    savingsRecords: state.savingsRecords,
    learningRecords: state.learningRecords,
    playbookRules: state.playbookRules,
    reinforcementSignals: state.reinforcementSignals,
    governancePolicy: state.governancePolicy,
    learningApprovals: state.learningApprovals,
    backendFoundation: state.backendFoundation,
    supplierReplies: state.supplierReplies
  };
}

function applySession(session) {
  const filters = { ...defaultFilters(), ...(session.filters || {}) };
  const validProductIds = new Set(products.map((product) => product.id));

  state.query = String(filters.query || "");
  state.category = categories.includes(filters.category) ? filters.category : "all";
  state.region = filters.region || "all";
  state.sourceType = filters.sourceType || "all";
  state.confidence = filters.confidence || "all";
  state.priority = ["balanced", "speed", "cost"].includes(filters.priority) ? filters.priority : "balanced";
  state.datasheetOnly = Boolean(filters.datasheetOnly);
  state.verifiedOnly = Boolean(filters.verifiedOnly);
  state.shortlist = [...new Set(session.shortlist || [])].filter((id) => validProductIds.has(id));
  state.compare = [...new Set(session.compare || [])].filter((id) => validProductIds.has(id)).slice(0, 4);
  state.notes = { ...state.notes, ...sanitizeNotes(session.notes || {}, validProductIds) };
  state.productRequests = Array.isArray(session.productRequests)
    ? session.productRequests.map(sanitizeProductRequest).filter(Boolean).slice(0, 30)
    : state.productRequests;
  state.sourceLeads = Array.isArray(session.sourceLeads)
    ? session.sourceLeads.map(sanitizeSourceLead).filter(Boolean).slice(0, 120)
    : state.sourceLeads;
  state.launchPartners = Array.isArray(session.launchPartners)
    ? session.launchPartners.map(sanitizeLaunchPartner).filter(Boolean).slice(0, 120)
    : state.launchPartners;
  state.pilotRuns = Array.isArray(session.pilotRuns)
    ? session.pilotRuns.map(sanitizePilotRun).filter(Boolean).slice(0, 120)
    : state.pilotRuns;
  state.quotes = Array.isArray(session.quotes) ? session.quotes.map(sanitizeQuoteRecord).filter(Boolean).slice(0, 80) : state.quotes;
  state.savingsRecords = Array.isArray(session.savingsRecords)
    ? session.savingsRecords.map(sanitizeSavingsRecord).filter(Boolean).slice(0, 120)
    : state.savingsRecords;
  state.learningRecords = Array.isArray(session.learningRecords)
    ? session.learningRecords.map(sanitizeLearningRecord).filter(Boolean).slice(0, 160)
    : state.learningRecords;
  state.playbookRules = Array.isArray(session.playbookRules)
    ? session.playbookRules.map(sanitizePlaybookRule).filter(Boolean).slice(0, 120)
    : state.playbookRules;
  state.reinforcementSignals = Array.isArray(session.reinforcementSignals)
    ? session.reinforcementSignals.map(sanitizeReinforcementSignal).filter(Boolean).slice(0, 220)
    : state.reinforcementSignals;
  state.governancePolicy = sanitizeGovernancePolicy(session.governancePolicy || state.governancePolicy);
  state.learningApprovals = sanitizeLearningApprovals(session.learningApprovals || state.learningApprovals);
  state.backendFoundation = sanitizeBackendFoundation(session.backendFoundation || state.backendFoundation);
  state.supplierReplies = Array.isArray(session.supplierReplies)
    ? session.supplierReplies.map(sanitizeSupplierReply).filter(Boolean).slice(0, 120)
    : state.supplierReplies;
  state.project = sanitizeProjectProfile(session.project || {});
  state.specRequirements = sanitizeSpecRequirements(session.specRequirements || {});
  state.alternateReview = sanitizeAlternateReview(session.alternateReview || {});
  state.substitutionApproval = sanitizeSubstitutionApproval(session.substitutionApproval || {});
  state.landedCost = sanitizeLandedCostScenario(session.landedCost || {});
  state.negotiationPlan = sanitizeNegotiationPlan(session.negotiationPlan || {});
  state.playbookConfig = sanitizePlaybookConfig(session.playbookConfig || {});

  setQuery(state.query);
  hydrateProjectFields();
  hydrateSpecRequirementFields();
  hydrateAlternateReviewFields();
  hydrateSubstitutionApprovalFields();
  hydrateLandedCostFields();
  hydrateNegotiationFields();
  hydrateLearningForm();
  hydratePlaybookControls();
  hydrateSignalForm();
  hydrateGovernanceControls();
  els.category.value = state.category;
  els.region.value = state.region;
  els.sourceType.value = state.sourceType;
  els.confidence.value = state.confidence;
  els.datasheetOnly.checked = state.datasheetOnly;
  els.verifiedOnly.checked = state.verifiedOnly;
  els.priorityButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.priority === state.priority);
  });
  saveNotes();
  saveProductRequests();
  saveSourceLeads();
  saveLaunchPartners();
  savePilotRuns();
  saveQuoteRecords();
  saveSavingsRecords();
  saveLearningRecords();
  savePlaybookConfig();
  savePlaybookRules();
  saveReinforcementSignals();
  saveGovernancePolicy();
  saveLearningApprovals();
  saveBackendFoundation();
  saveSupplierReplies();
  saveProjectProfile();
  saveSpecRequirements();
  saveAlternateReview();
  saveSubstitutionApproval();
  saveLandedCostScenario();
  saveNegotiationPlan();
  renderProjectStatus();
  renderProductRequests();
  renderSourceIntake();
  renderCompare();
  renderSpecMatchDesk();
  renderAlternateDesk();
  renderSubstitutionApprovalPack();
  renderQuoteTracker();
  renderLandedCostDesk();
  renderNegotiationDesk();
  renderSavingsRegister();
  renderLearningLoop();
  renderPlaybookLab();
  renderReinforcementLab();
  renderGovernanceCenter();
  renderLearningQueue();
  renderAiLoop();
  renderTenantAdmin();
  renderIntegrationBlueprint();
  renderSaasGate();
  hydrateFoundationControls();
  renderFoundationPlanner();
  renderPilotPack();
  renderDemoProofPack();
  renderValueProofPack();
  hydrateLaunchPartnerForm();
  renderLaunchPartnerPipeline();
  hydratePilotOpsForm();
  renderPilotOpsBoard();
  populateReplyItems();
  renderSupplierInbox();
  renderShortlist();
  closeOverlays();
}

function saveSession() {
  try {
    window.localStorage.setItem("induscoutSession", JSON.stringify(createSessionSnapshot()));
    setSessionStatus("Session saved locally");
  } catch {
    setSessionStatus("Session could not be saved");
  }
}

function loadSession() {
  try {
    const rawSession = window.localStorage.getItem("induscoutSession");
    if (!rawSession) {
      setSessionStatus("No saved session found");
      return;
    }
    applySession(parseSessionJson(rawSession));
    render();
    setSessionStatus("Saved session loaded");
  } catch {
    setSessionStatus("Saved session could not be loaded");
  }
}

function exportSessionFile() {
  const snapshot = createSessionSnapshot();
  downloadFile(`InduScout-Session-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(snapshot, null, 2), "application/json;charset=utf-8");
  setSessionStatus("Session JSON exported");
}

function importSessionFile(event) {
  const file = event.target.files?.[0];
  event.target.value = "";
  if (!file) {
    return;
  }
  if (file.size > SESSION_IMPORT_MAX_BYTES) {
    setSessionStatus("Session JSON is too large");
    return;
  }
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    try {
      applySession(parseSessionJson(String(reader.result || "{}")));
      render();
      setSessionStatus("Session JSON imported");
    } catch {
      setSessionStatus("Session JSON could not be imported");
    }
  });
  reader.readAsText(file);
}

function setSessionStatus(message) {
  els.sessionStatus.textContent = message;
  setTimeout(() => {
    els.sessionStatus.textContent = "Save project, filters, shortlist, spec, alternate, approval, quote, cost, negotiation, savings, learning, playbooks, signals, governance policy, learning approvals, SaaS foundation plan, supplier inbox, and notes locally.";
  }, 1800);
}

function projectInputs() {
  return [els.projectName, els.projectBuyer, els.projectContact, els.projectCountry, els.projectTargetDate, els.projectNotes].filter(Boolean);
}

function defaultProjectProfile() {
  return {
    name: "",
    buyer: "",
    contact: "",
    country: "",
    targetDate: "",
    notes: ""
  };
}

function hydrateProjectFields() {
  if (!els.projectName) {
    return;
  }

  els.projectName.value = state.project.name || "";
  els.projectBuyer.value = state.project.buyer || "";
  els.projectContact.value = state.project.contact || "";
  els.projectCountry.value = state.project.country || "";
  els.projectTargetDate.value = state.project.targetDate || "";
  els.projectNotes.value = state.project.notes || "";
}

function updateProjectFromFields() {
  if (!els.projectName) {
    return;
  }

  state.project = projectFromFields();
  saveProjectProfile();
  renderProjectStatus();
}

function saveProjectFromFields() {
  if (!els.saveProject) {
    return;
  }

  updateProjectFromFields();
  els.saveProject.textContent = "Project saved";
  setTimeout(() => {
    els.saveProject.textContent = "Save project";
  }, 1200);
}

async function copyProjectBrief() {
  updateProjectFromFields();
  const selected = state.shortlist.map((id) => products.find((product) => product.id === id)).filter(Boolean);
  const text = `InduScout project RFQ brief
Prepared on ${formatCopyDate()}

Project: ${projectValue("name", "Unnamed sourcing project")}
Buyer/company: ${projectValue("buyer", "TBC")}
Buyer contact: ${projectValue("contact", "TBC")}
Delivery country: ${projectValue("country", "TBC")}
Target date: ${projectValue("targetDate", "TBC")}
Fit priority: ${priorityLabel()}
Shortlisted products: ${selected.length}

Project notes:
${projectValue("notes", "No project notes added")}

Shortlist:
${selected.length ? selected.map((product, index) => `${index + 1}. ${product.brand} ${product.sku} - ${product.name} (${product.category})`).join("\n") : "- No products shortlisted yet"}

Buyer verification:
- Confirm exact part numbers, suffixes, voltage, size, material, and configuration.
- Confirm compatibility with installed equipment or project specification.
- Request latest datasheets, certificates, warranty path, country of origin, price, lead time, payment terms, and delivery terms.
- Treat alternates as technical review items, not automatic substitutes.`;

  try {
    await navigator.clipboard.writeText(text);
    if (!els.copyProjectBrief) {
      return;
    }
    els.copyProjectBrief.textContent = "Project brief copied";
    setTimeout(() => {
      els.copyProjectBrief.textContent = "Copy project brief";
    }, 1400);
  } catch {
    window.prompt("Copy project brief", text);
  }
}

async function copyPrivacyBrief() {
  const text = `InduScout privacy and trust brief
Prepared on ${formatCopyDate()}

Current product status:
InduScout is a static GitHub Pages public beta for industrial product discovery and RFQ preparation.

What stays local:
- Buyer notes
- Project context
- Spec match requirement profile
- Alternate and obsolescence review setup
- Substitution approval pack setup
- Landed cost scenario inputs
- Negotiation plan inputs
- Savings register records
- Shortlists and compare selections
- Quote tracker records
- Supplier inbox replies
- Supplier/source intake leads
- Saved session data

How data leaves the browser:
- The user exports RFQ packs, CSV, XLSX, source intake registers, savings registers, workspace snapshots, evidence review JSON, decision memo HTML, PO handover HTML, supplier compliance HTML, buyer file HTML/JSON, supplier scorecard HTML/JSON, spec match matrix HTML/JSON, alternate review HTML/JSON, substitution approval HTML/JSON, landed cost HTML/JSON, negotiation HTML/JSON, savings JSON, or session JSON files.
- The user copies RFQ, supplier email, supplier counter-offer email, supplier confirmation email, supplier due-diligence email, buyer reply, project brief, procurement brief, source review packet, evidence review report, decision memo, award handover note, compliance pack, buyer file index, supplier scorecard, spec match matrix, alternate review note, substitution approval note, landed cost brief, negotiation savings note, savings register notes, or data update text.
- The user manually shares downloaded files or copied text.

What the beta does not currently use:
- No login system
- No backend database
- No payment workflow
- No embedded API keys
- No server-side buyer record storage

Public beta guidance:
Users should avoid entering confidential tender data, passwords, access tokens, payment data, regulated personal data, private contracts, or sensitive commercial documents until a governed backend, privacy terms, retention policy, and access controls exist.

Security baseline:
- Imported session JSON is size-limited and sanitized before use.
- CSV and XLSX exports guard against common spreadsheet formula injection patterns.
- Source links are restricted to safe web and email protocols.
- Downloaded filenames are sanitized.

Future backend requirements:
Before accounts, supplier submissions, shared projects, APIs, or server-side quote storage are launched, InduScout should add access control, audit logs, encrypted storage, rate limits, deletion workflows, monitoring, backups, privacy policy, and terms of use.`;

  try {
    await navigator.clipboard.writeText(text);
    if (!els.copyPrivacyBrief) {
      return;
    }
    els.copyPrivacyBrief.textContent = "Privacy brief copied";
    setTimeout(() => {
      els.copyPrivacyBrief.textContent = "Copy privacy brief";
    }, 1400);
  } catch {
    window.prompt("Copy privacy brief", text);
  }
}

function clearProjectProfile() {
  state.project = defaultProjectProfile();
  hydrateProjectFields();
  saveProjectProfile();
  renderProjectStatus();
}

function projectFromFields() {
  return {
    name: els.projectName?.value.trim() || "",
    buyer: els.projectBuyer?.value.trim() || "",
    contact: els.projectContact?.value.trim() || "",
    country: els.projectCountry?.value.trim() || "",
    targetDate: els.projectTargetDate?.value || "",
    notes: els.projectNotes?.value.trim() || ""
  };
}

function projectHasValue() {
  return Object.values(state.project).some((value) => String(value || "").trim());
}

function projectValue(key, fallback) {
  const value = String(state.project[key] || "").trim();
  return value || fallback;
}

function renderProjectStatus() {
  if (!els.projectStatus) {
    renderShortlistProjectSummary();
    renderBuyerWorkspace();
    renderDecisionMemo();
    renderAwardHandover();
    renderComplianceGate();
    renderBuyerFile();
    return;
  }

  els.projectStatus.textContent = projectHasValue() ? projectValue("name", "Project context added") : "Add project context for exports";
  renderShortlistProjectSummary();
  renderBuyerWorkspace();
  renderDecisionMemo();
  renderAwardHandover();
  renderComplianceGate();
  renderBuyerFile();
}

function renderShortlistProjectSummary() {
  if (!els.shortlistProjectSummary) {
    return;
  }

  if (!projectHasValue()) {
    els.shortlistProjectSummary.innerHTML = `
      <strong>No project profile yet</strong>
      <span>Add project details in Finder so RFQ exports include buyer, delivery, target date, and notes.</span>
    `;
    els.shortlistProjectSummary.classList.add("empty");
    return;
  }

  els.shortlistProjectSummary.classList.remove("empty");
  els.shortlistProjectSummary.innerHTML = `
    <strong>${escapeHtml(projectValue("name", "Project RFQ workspace"))}</strong>
    <span>${escapeHtml(projectValue("buyer", "Buyer TBC"))} &middot; ${escapeHtml(projectValue("country", "Delivery TBC"))} &middot; Target ${escapeHtml(projectValue("targetDate", "TBC"))}</span>
  `;
}

function openProductRequestPanel() {
  if (state.query && !els.requestPart.value.trim()) {
    els.requestPart.value = state.query;
  }
  if (state.category !== "all" && categories.includes(state.category)) {
    els.requestCategory.value = state.category;
  }
  if (state.project.country && !els.requestCountry.value.trim()) {
    els.requestCountry.value = state.project.country;
  }
  els.productRequestPanel.open = true;
  els.productRequestPanel.scrollIntoView({ behavior: "smooth", block: "center" });
  setTimeout(() => {
    els.requestPart.focus({ preventScroll: true });
  }, 250);
}

async function copyProductRequest() {
  const requestText = productRequestText(productRequestSnapshot());

  try {
    await navigator.clipboard.writeText(requestText);
    els.copyProductRequest.textContent = "Product request copied";
    setTimeout(() => {
      els.copyProductRequest.textContent = "Copy product request";
    }, 1400);
  } catch {
    window.prompt("Copy product request", requestText);
  }
}

function saveProductRequest() {
  const request = sanitizeProductRequest(productRequestSnapshot());
  if (!request.part || request.part === "TBC") {
    els.saveProductRequest.textContent = "Add item first";
    setTimeout(() => {
      els.saveProductRequest.textContent = "Save request";
    }, 1200);
    return;
  }

  state.productRequests = [request, ...state.productRequests.filter((item) => item.id !== request.id)].slice(0, 30);
  saveProductRequests();
  renderProductRequests();
  els.saveProductRequest.textContent = "Request saved";
  setTimeout(() => {
    els.saveProductRequest.textContent = "Save request";
  }, 1200);
}

async function copyResearchBrief() {
  const request = productRequestSnapshot();
  const text = `InduScout missing-product research brief
Prepared on ${formatCopyDate()}

Research target: ${request.part}
Brand or maker: ${request.brand}
Likely category: ${request.category}
Delivery country: ${request.country}
Urgency: ${request.urgency}
Quantity: ${request.quantity}

Research objective:
- Identify exact manufacturer part number and possible suffix/configuration variants.
- Find official OEM page, datasheet, manual, certificate, and lifecycle status.
- Find authorized distributor or reliable supplier paths for the requested delivery country.
- Identify alternates for technical review only, not automatic substitution.
- Capture lead time, MOQ, warranty path, seller legitimacy, and country-of-origin questions.

Suggested source path:
- OEM/manufacturer website first.
- Authorized distributors or regional distributors second.
- Datasheet/specification directories for comparison.
- Marketplace or surplus channels only after seller and warranty terms are reviewed.

Finder context:
- Search query: ${request.query}
- Category filter: ${request.filters.category}
- Region filter: ${request.filters.region}
- Source type filter: ${request.filters.sourceType}
- Confidence filter: ${request.filters.confidence}

Application or notes:
${request.notes}

Output requested:
Return candidate product record details, source links, datasheet link, alternates, and buyer verification questions before adding to the catalog.`;

  try {
    await navigator.clipboard.writeText(text);
    els.copyResearchBrief.textContent = "Research brief copied";
    setTimeout(() => {
      els.copyResearchBrief.textContent = "Copy research brief";
    }, 1400);
  } catch {
    window.prompt("Copy research brief", text);
  }
}

function productRequestSnapshot() {
  const category = requestFieldValue(els.requestCategory, "Not sure");
  const part = requestFieldValue(els.requestPart, state.query || "TBC");
  return {
    id: `${Date.now()}-${part.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 42) || "request"}`,
    savedAt: new Date().toISOString(),
    part,
    brand: requestFieldValue(els.requestBrand, "TBC"),
    category,
    country: requestFieldValue(els.requestCountry, projectValue("country", "TBC")),
    urgency: requestFieldValue(els.requestUrgency, "Standard sourcing"),
    quantity: requestFieldValue(els.requestQuantity, "TBC"),
    notes: requestFieldValue(els.requestNotes, "No extra notes added"),
    query: state.query || "None",
    filters: {
      category: state.category === "all" ? "All categories" : state.category,
      region: state.region === "all" ? "Global" : state.region,
      sourceType: state.sourceType === "all" ? "All source types" : state.sourceType,
      confidence: state.confidence === "all" ? "All confidence levels" : state.confidence
    }
  };
}

function productRequestText(request) {
  return `InduScout product request
Prepared from InduScout finder on ${formatCopyDate()}

Requested item or part number: ${request.part}
Brand or maker: ${request.brand}
Likely category: ${request.category}
Delivery country: ${request.country}
Urgency: ${request.urgency}
Quantity: ${request.quantity}

Current finder context:
- Search query: ${request.query}
- Category filter: ${request.filters.category}
- Region filter: ${request.filters.region}
- Source type filter: ${request.filters.sourceType}
- Confidence filter: ${request.filters.confidence}

Application or notes:
${request.notes}

Please help identify the exact part number, manufacturer page, datasheet, authorized distributors or supplier paths, alternates for technical review, lead time, MOQ, certifications, and buying/source links.

InduScout is a discovery and RFQ preparation aid. Final purchasing validation remains with the buyer and supplier.`;
}

function renderProductRequests() {
  const count = state.productRequests.length;
  els.requestCount.textContent = count ? `${count} saved ${count === 1 ? "request" : "requests"}` : "0 saved requests";

  if (!count) {
    els.requestList.innerHTML = '<div class="request-list-empty">No saved missing-product requests yet.</div>';
    renderBuyerWorkspace();
    renderEvidenceReviewBoard();
    return;
  }

  els.requestList.innerHTML = state.productRequests
    .map(
      (request) => `
        <article class="saved-request-card">
          <div>
            <span>${escapeHtml(request.category)}</span>
            <strong>${escapeHtml(request.part)}</strong>
            <small>${escapeHtml(request.brand)} &middot; ${escapeHtml(request.country)} &middot; ${escapeHtml(request.urgency)}</small>
          </div>
          <div>
            <button type="button" data-load-request="${escapeHtml(request.id)}">Load</button>
            <button type="button" data-copy-request="${escapeHtml(request.id)}">Copy</button>
            <button type="button" data-remove-request="${escapeHtml(request.id)}">Remove</button>
          </div>
        </article>
      `
    )
    .join("");
  renderBuyerWorkspace();
  renderEvidenceReviewBoard();
}

async function copySavedProductRequest(id) {
  const request = state.productRequests.find((item) => item.id === id);
  if (!request) {
    return;
  }
  try {
    await navigator.clipboard.writeText(productRequestText(request));
  } catch {
    window.prompt("Copy saved product request", productRequestText(request));
  }
}

function loadSavedProductRequest(id) {
  const request = state.productRequests.find((item) => item.id === id);
  if (!request) {
    return;
  }
  els.requestPart.value = request.part === "TBC" ? "" : request.part;
  els.requestBrand.value = request.brand === "TBC" ? "" : request.brand;
  els.requestCategory.value = request.category;
  els.requestCountry.value = request.country === "TBC" ? "" : request.country;
  els.requestUrgency.value = request.urgency;
  els.requestQuantity.value = request.quantity === "TBC" ? "" : request.quantity;
  els.requestNotes.value = request.notes === "No extra notes added" ? "" : request.notes;
  els.productRequestPanel.open = true;
}

function removeSavedProductRequest(id) {
  state.productRequests = state.productRequests.filter((item) => item.id !== id);
  saveProductRequests();
  renderProductRequests();
}

function clearProductRequestForm() {
  els.requestPart.value = "";
  els.requestBrand.value = "";
  els.requestCategory.value = "Not sure";
  els.requestCountry.value = "";
  els.requestUrgency.value = "Standard sourcing";
  els.requestQuantity.value = "";
  els.requestNotes.value = "";
}

function requestFieldValue(element, fallback) {
  const value = String(element?.value || "").trim();
  return value || fallback;
}

async function copyShortlist() {
  updateProjectFromFields();
  const selected = state.shortlist.map((id) => products.find((product) => product.id === id)).filter(Boolean);
  const text = selected.length
    ? `InduScout RFQ shortlist
Project: ${projectValue("name", "Unnamed sourcing project")}
Buyer/company: ${projectValue("buyer", "TBC")}
Buyer contact: ${projectValue("contact", "TBC")}
Delivery country: ${projectValue("country", "TBC")}
Target date: ${projectValue("targetDate", "TBC")}
Project notes: ${projectValue("notes", "No project notes added")}

${selected
        .map((product, index) => {
          const sources = product.sources.map((source) => `${source.type} - ${source.name}: ${source.url}`).join("; ");
          return `${index + 1}. ${product.brand} ${product.sku} - ${product.name}
Category: ${product.category}
Specs: ${product.specs.join(", ")}
Applications: ${product.applications.join(", ")}
Alternatives: ${product.alternatives.join(", ")}
Sources: ${sources}`;
        })
        .join("\n\n")}`
    : "InduScout RFQ shortlist is empty.";

  try {
    await navigator.clipboard.writeText(text);
    els.copyShortlist.textContent = "Copied";
    setTimeout(() => {
      els.copyShortlist.textContent = "Copy RFQ summary";
    }, 1200);
  } catch {
    window.prompt("Copy RFQ summary", text);
  }
}

function downloadRfqPack() {
  updateProjectFromFields();
  const selected = state.shortlist.map((id) => products.find((product) => product.id === id)).filter(Boolean);

  if (!selected.length) {
    els.downloadRfqPack.textContent = "Add items first";
    setTimeout(() => {
      els.downloadRfqPack.textContent = "Download RFQ pack";
    }, 1200);
    return;
  }

  const totalSources = selected.reduce((count, product) => count + product.sources.length, 0);
  const isoDate = new Date().toISOString().slice(0, 10);
  const productWord = selected.length === 1 ? "Product" : "Products";
  const projectSlug = safeFilenamePart(projectValue("name", ""));
  const packFilenameBase = projectSlug
    ? `InduScout-RFQ-Pack-${projectSlug}-${isoDate}-${selected.length}-${productWord}`
    : `InduScout-RFQ-Pack-${isoDate}-${selected.length}-${productWord}`;
  const packTitle = projectHasValue()
    ? `InduScout RFQ Pack - ${projectValue("name", "Project")} - ${isoDate}`
    : `InduScout RFQ Pack - ${isoDate} - ${selected.length} ${productWord}`;
  const productCards = selected
    .map((product, index) => {
      const confidence = confidenceForProduct(product);
      const sources = product.sources
        .map((source) => `<li><strong>${escapeHtml(source.type)}:</strong> <a href="${safeHref(source.url)}">${escapeHtml(source.name)}</a></li>`)
        .join("");
      const notes = state.notes[product.id] || "None added";
      return `
        <section class="product">
          <div class="product-head">
            <div>
              <p class="eyebrow">Item ${index + 1}</p>
              <h2>${escapeHtml(product.brand)} ${escapeHtml(product.sku)} - ${escapeHtml(product.name)}</h2>
              <p>${escapeHtml(product.description)}</p>
            </div>
            <div class="score">
              <span>${escapeHtml(priorityLabel())} fit</span>
              <strong>${escapeHtml(product[state.priority])}</strong>
            </div>
          </div>
          <dl>
            <div><dt>Category</dt><dd>${escapeHtml(product.category)}</dd></div>
            <div><dt>Family</dt><dd>${escapeHtml(product.family)}</dd></div>
            <div><dt>Lead time</dt><dd>${escapeHtml(product.lead)}</dd></div>
            <div><dt>MOQ</dt><dd>${escapeHtml(product.moq)}</dd></div>
            <div><dt>Lifecycle</dt><dd>${escapeHtml(product.lifecycle)}</dd></div>
            <div><dt>Datasheet</dt><dd>${product.datasheet ? "Available" : "Check with supplier"}</dd></div>
            <div><dt>Certifications</dt><dd>${escapeHtml(product.certifications.join(", ") || "Check with supplier")}</dd></div>
            <div><dt>Confidence</dt><dd>${escapeHtml(confidence.label)} - ${escapeHtml(confidence.reason)}</dd></div>
          </dl>
          <h3>Key specifications</h3>
          <ul>${product.specs.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
          <h3>Applications</h3>
          <ul>${product.applications.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
          <h3>Alternates for review</h3>
          <ul>${product.alternatives.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
          <h3>Source paths</h3>
          <ul>${sources}</ul>
          <h3>Buyer notes</h3>
          <p class="notes">${escapeHtml(notes)}</p>
        </section>
      `;
    })
    .join("");

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(packTitle)}</title>
    <style>
      @page { size: A4; margin: 11mm; }
      :root { color: #0f172a; background: #f8fafc; font-family: Arial, sans-serif; }
      body { margin: 0; padding: 24px; font-size: 14px; line-height: 1.45; }
      main { max-width: 980px; margin: 0 auto; }
      header, section, .checklist { background: #ffffff; border: 1px solid #dbe4ef; border-radius: 8px; box-shadow: 0 14px 36px rgba(15, 23, 42, 0.08); }
      header { padding: 22px; margin-bottom: 14px; }
      h1, h2, h3, p { margin-top: 0; }
      h1 { font-size: 30px; margin-bottom: 8px; }
      h2 { font-size: 20px; margin-bottom: 8px; }
      h3 { font-size: 12px; margin: 14px 0 6px; text-transform: uppercase; color: #007a78; }
      a { color: #007a78; }
      .print-toolbar { position: sticky; top: 0; z-index: 5; display: flex; align-items: center; justify-content: space-between; gap: 14px; max-width: 980px; margin: 0 auto 14px; padding: 12px; background: #ffffff; border: 1px solid #dbe4ef; border-radius: 8px; box-shadow: 0 12px 28px rgba(15, 23, 42, 0.12); }
      .print-toolbar button { min-height: 42px; padding: 0 18px; color: #ffffff; background: #0f172a; border: 1px solid #0f172a; border-radius: 8px; font-weight: 700; }
      .print-toolbar span { color: #475569; font-size: 12px; }
      .meta { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; margin-top: 14px; }
      .meta div, dl div { padding: 8px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; }
      .meta span, dt, .eyebrow { display: block; color: #64748b; font-size: 11px; font-weight: 700; text-transform: uppercase; }
      .meta strong, dd { margin: 3px 0 0; font-weight: 700; }
      .project-meta { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; margin-top: 12px; }
      .project-meta div { padding: 9px; background: #f0fdfa; border: 1px solid #99f6e4; border-radius: 6px; }
      .project-notes { margin: 10px 0 0; padding: 9px; background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 6px; }
      .product { padding: 18px; margin-bottom: 14px; }
      .product-head { display: grid; grid-template-columns: minmax(0, 1fr) 94px; gap: 14px; align-items: start; }
      .score { text-align: right; padding: 10px; background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; }
      .score strong { display: block; font-size: 30px; }
      dl { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; margin: 12px 0 0; }
      ul { margin: 0; padding-left: 22px; }
      li { margin: 3px 0; }
      .notes { padding: 8px; background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 6px; }
      .checklist { padding: 18px; }
      .disclaimer { margin-top: 14px; color: #475569; font-size: 12px; }
      @media print {
        body { background: #ffffff; padding: 0; font-size: 11px; line-height: 1.28; }
        main { max-width: none; }
        .print-toolbar { display: none; }
        header, section, .checklist { box-shadow: none; border-radius: 0; }
        header { padding: 0 0 8px; margin: 0 0 8px; border: 0; border-bottom: 2px solid #007a78; }
        h1 { font-size: 22px; margin-bottom: 4px; }
        h2 { font-size: 15px; margin-bottom: 4px; }
        h3 { font-size: 10px; margin: 8px 0 3px; }
        .meta { margin-top: 8px; gap: 4px; }
        .meta div, dl div { padding: 5px; }
        .project-meta { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 4px; margin-top: 6px; }
        .project-meta div, .project-notes { padding: 5px; }
        .product { padding: 8px 0; margin: 0; border: 0; border-top: 1px solid #dbe4ef; break-inside: auto; page-break-inside: auto; }
        .product-head { grid-template-columns: minmax(0, 1fr) 64px; gap: 8px; }
        .score { padding: 5px; }
        .score strong { font-size: 22px; }
        dl { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 4px; margin-top: 6px; }
        ul { padding-left: 16px; }
        li { margin: 1px 0; }
        .notes { padding: 5px; }
        .checklist { padding: 8px 0 0; border: 0; border-top: 2px solid #007a78; }
        .disclaimer { margin-top: 8px; font-size: 10px; }
        a { color: inherit; text-decoration: none; }
      }
    </style>
  </head>
  <body>
    <div class="print-toolbar">
      <button type="button" onclick="window.print()">Save as PDF</button>
      <span>Suggested PDF name: ${escapeHtml(packFilenameBase)}.pdf</span>
    </div>
    <main>
      <header>
        <p class="eyebrow">InduScout sourcing document</p>
        <h1>${escapeHtml(projectHasValue() ? projectValue("name", "RFQ Shortlist Pack") : "RFQ Shortlist Pack")}</h1>
        <p>Prepared for buyer review, supplier outreach, and RFQ preparation. Confirm all purchase decisions with the OEM, authorized distributor, or supplier.</p>
        <div class="meta">
          <div><span>Prepared</span><strong>${escapeHtml(formatCopyDate())}</strong></div>
          <div><span>Products</span><strong>${selected.length}</strong></div>
          <div><span>Source links</span><strong>${totalSources}</strong></div>
          <div><span>Fit priority</span><strong>${escapeHtml(priorityLabel())}</strong></div>
        </div>
        <div class="project-meta">
          <div><span>Project</span><strong>${escapeHtml(projectValue("name", "Not provided"))}</strong></div>
          <div><span>Buyer / company</span><strong>${escapeHtml(projectValue("buyer", "TBC"))}</strong></div>
          <div><span>Buyer contact</span><strong>${escapeHtml(projectValue("contact", "TBC"))}</strong></div>
          <div><span>Delivery country</span><strong>${escapeHtml(projectValue("country", "TBC"))}</strong></div>
          <div><span>Target date</span><strong>${escapeHtml(projectValue("targetDate", "TBC"))}</strong></div>
        </div>
        <p class="project-notes"><strong>Project notes:</strong> ${escapeHtml(projectValue("notes", "No project notes added"))}</p>
      </header>
      ${productCards}
      <div class="checklist">
        <h2>Buyer verification checklist</h2>
        <ul>
          <li>Confirm exact part number, suffix, voltage, size, material, and configuration.</li>
          <li>Confirm compatibility with installed equipment or project specification.</li>
          <li>Request latest datasheet, certificate, warranty path, and country of origin.</li>
          <li>Confirm stock, unit price, offer validity, lead time, MOQ, payment terms, delivery terms, and seller legitimacy.</li>
          <li>Treat alternates as technical review items, not automatic substitutes.</li>
        </ul>
        <p class="disclaimer">InduScout is a discovery and RFQ preparation aid. Final purchasing validation remains with the buyer and supplier.</p>
      </div>
    </main>
  </body>
</html>`;

  downloadFile(`${packFilenameBase}.html`, html, "text/html;charset=utf-8");
  els.downloadRfqPack.textContent = "RFQ pack downloaded";
  setTimeout(() => {
    els.downloadRfqPack.textContent = "Download RFQ pack";
  }, 1200);
}

function downloadShortlistCsv() {
  const table = shortlistExportTable();
  if (!table.rows.length) {
    els.downloadShortlist.textContent = "Add items first";
    setTimeout(() => {
      els.downloadShortlist.textContent = "Download CSV";
    }, 1200);
    return;
  }

  const csv = [table.headers, ...table.rows].map((row) => row.map(csvEscape).join(",")).join("\r\n");
  const projectSlug = safeFilenamePart(projectValue("name", ""));
  const filename = projectSlug
    ? `InduScout-Shortlist-${projectSlug}-${new Date().toISOString().slice(0, 10)}.csv`
    : `induscout-shortlist-${new Date().toISOString().slice(0, 10)}.csv`;
  downloadFile(filename, `\ufeff${csv}`, "text/csv;charset=utf-8");

  els.downloadShortlist.textContent = "CSV downloaded";
  setTimeout(() => {
    els.downloadShortlist.textContent = "Download CSV";
  }, 1200);
}

function downloadShortlistXlsx() {
  const table = shortlistExportTable();
  if (!table.rows.length) {
    els.downloadShortlistXlsx.textContent = "Add items first";
    setTimeout(() => {
      els.downloadShortlistXlsx.textContent = "Download XLSX";
    }, 1200);
    return;
  }

  const workbook = createXlsxWorkbook(table.headers, table.rows);
  const projectSlug = safeFilenamePart(projectValue("name", ""));
  downloadFile(
    projectSlug
      ? `InduScout-Shortlist-${projectSlug}-${new Date().toISOString().slice(0, 10)}.xlsx`
      : `InduScout-Shortlist-${new Date().toISOString().slice(0, 10)}.xlsx`,
    workbook,
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  els.downloadShortlistXlsx.textContent = "XLSX downloaded";
  setTimeout(() => {
    els.downloadShortlistXlsx.textContent = "Download XLSX";
  }, 1200);
}

function shortlistExportTable() {
  updateProjectFromFields();
  const selected = state.shortlist.map((id) => products.find((product) => product.id === id)).filter(Boolean);
  const headers = [
    "Project Name",
    "Buyer / Company",
    "Buyer Contact",
    "Delivery Country",
    "Target Date",
    "Project Notes",
    "Brand",
    "SKU",
    "Product Name",
    "Category",
    "Family",
    "Lifecycle",
    "Fit Priority",
    "Fit Score",
    "Lead Time",
    "MOQ",
    "Datasheet",
    "Certifications",
    "Specifications",
    "Applications",
    "Alternates",
    "Source Names",
    "Source URLs",
    "Primary Source",
    "Buyer Notes"
  ];
  const rows = selected.map((product) => {
    const sourceNames = product.sources.map((source) => `${source.type}: ${source.name}`).join(" | ");
    const sourceUrls = product.sources.map((source) => source.url).join(" | ");
    return [
      projectValue("name", ""),
      projectValue("buyer", ""),
      projectValue("contact", ""),
      projectValue("country", ""),
      projectValue("targetDate", ""),
      projectValue("notes", ""),
      product.brand,
      product.sku,
      product.name,
      product.category,
      product.family,
      product.lifecycle,
      priorityLabel(),
      product[state.priority],
      product.lead,
      product.moq,
      product.datasheet ? "Yes" : "Check",
      product.certifications.join(" | ") || "Check with supplier",
      product.specs.join(" | "),
      product.applications.join(" | "),
      product.alternatives.join(" | "),
      sourceNames,
      sourceUrls,
      product.sources[0]?.url || "",
      state.notes[product.id] || ""
    ];
  });
  return { headers, rows };
}

async function copyCompare() {
  const selected = state.compare.map((id) => products.find((product) => product.id === id)).filter(Boolean);
  const text = selected.length
    ? selected
        .map((product, index) => {
          const sources = product.sources.map((source) => `${source.type} - ${source.name}: ${source.url}`).join("; ");
          const certs = product.certifications.length ? product.certifications.join(", ") : "Check";
          return `${index + 1}. ${product.brand} ${product.sku} - ${product.name}
Category: ${product.category}
${priorityLabel()} fit: ${product[state.priority]}
Lead time: ${product.lead}
MOQ: ${product.moq}
Lifecycle: ${product.lifecycle}
Datasheet: ${product.datasheet ? "Yes" : "Check"}
Certifications: ${certs}
Alternatives: ${product.alternatives.join(", ")}
Sources: ${sources}`;
        })
        .join("\n\n")
    : "No InduScout products selected for comparison.";

  try {
    await navigator.clipboard.writeText(text);
    els.copyCompare.textContent = "Copied";
    setTimeout(() => {
      els.copyCompare.textContent = "Copy comparison";
    }, 1200);
  } catch {
    window.prompt("Copy comparison", text);
  }
}

async function copyProductRfq(id) {
  updateProjectFromFields();
  const product = products.find((item) => item.id === id);
  if (!product) {
    return;
  }

  const quantity = getFieldValue("#rfqQuantity", defaultQuantity(product.moq));
  const country = getFieldValue("#rfqCountry", "TBC");
  const targetDate = getFieldValue("#rfqDate", "TBC");
  const urgency = getFieldValue("#rfqUrgency", "Standard sourcing");
  const acceptAlternates = document.querySelector("#rfqAlternates")?.checked ? "Yes" : "No";
  const buyerNotes = getFieldValue("#buyerNotes", "None added");
  const certs = product.certifications.length ? product.certifications.join(", ") : "Check with supplier";
  const sources = product.sources.map((source) => `${source.type} - ${source.name}: ${source.url}`).join("; ");
  const text = `RFQ request prepared with InduScout

Product: ${product.brand} ${product.sku} - ${product.name}
Project: ${projectValue("name", "Unnamed sourcing project")}
Buyer/company: ${projectValue("buyer", "TBC")}
Buyer contact: ${projectValue("contact", "TBC")}
Category: ${product.category}
Family: ${product.family}
Required quantity: ${quantity}
Delivery country: ${country}
Target date: ${targetDate}
Urgency: ${urgency}
Accept alternates: ${acceptAlternates}

Key specifications: ${product.specs.join(", ")}
Applications: ${product.applications.join(", ")}
Certifications requested: ${certs}
Known alternates: ${product.alternatives.join(", ")}
Preferred source links: ${sources}

Buyer notes:
${buyerNotes}

Please confirm exact part number, compatibility, datasheet revision, price, lead time, stock availability, warranty path, certificate availability, country of origin, and payment/delivery terms before order placement.`;

  try {
    await navigator.clipboard.writeText(text);
    const button = els.productDetailContent.querySelector("[data-copy-rfq]");
    if (button) {
      button.textContent = "RFQ copied";
      setTimeout(() => {
        button.textContent = "Copy RFQ request";
      }, 1200);
    }
  } catch {
    window.prompt("Copy RFQ request", text);
  }
}

async function copySupplierOutreach(id, triggerButton) {
  updateProjectFromFields();
  const product = products.find((item) => item.id === id);
  if (!product) {
    return;
  }

  const quantity = getFieldValue("#rfqQuantity", defaultQuantity(product.moq));
  const country = getFieldValue("#rfqCountry", "TBC");
  const targetDate = getFieldValue("#rfqDate", "TBC");
  const urgency = getFieldValue("#rfqUrgency", "Standard sourcing");
  const acceptAlternates = document.querySelector("#rfqAlternates")?.checked ? "Yes" : "No";
  const buyerNotes = getFieldValue("#buyerNotes", "None added");
  const certs = product.certifications.length ? product.certifications.join(", ") : "Please confirm available certificates";
  const alternatives = product.alternatives.length ? product.alternatives.map((item) => `- ${item}`).join("\n") : "- None listed";
  const text = `Subject: RFQ - ${product.brand} ${product.sku} - ${product.name}

Hello,

Please provide your quotation and availability for the item below.

Product: ${product.brand} ${product.sku} - ${product.name}
Project: ${projectValue("name", "Unnamed sourcing project")}
Buyer/company: ${projectValue("buyer", "TBC")}
Category: ${product.category}
Family: ${product.family}
Description: ${product.description}
Required quantity: ${quantity}
Delivery country: ${country}
Target date: ${targetDate}
Urgency: ${urgency}
Accept equivalent alternates if exact part is unavailable: ${acceptAlternates}

Key specifications:
${product.specs.map((item) => `- ${item}`).join("\n")}

Certifications requested:
${certs}

Please confirm:
- Exact part number, suffix, voltage, size, material, and configuration.
- Current stock, unit price, currency, offer validity, MOQ, and pack quantity.
- Lead time, delivery terms, payment terms, and shipping weight or dimensions if available.
- Latest datasheet revision, certificate availability, warranty path, and country of origin.
- Whether supply is through an OEM, authorized distributor, or other verified channel.

Known alternates for technical review only:
${alternatives}

Buyer notes:
${buyerNotes}

Thank you.`;

  try {
    await navigator.clipboard.writeText(text);
    const button = triggerButton || els.productDetailContent.querySelector("[data-copy-supplier]");
    if (button) {
      button.textContent = "Supplier email copied";
      setTimeout(() => {
        button.textContent = "Copy supplier email";
      }, 1200);
    }
  } catch {
    window.prompt("Copy supplier email", text);
  }
}

async function copyProcurementBrief(id, triggerButton) {
  updateProjectFromFields();
  const product = products.find((item) => item.id === id);
  if (!product) {
    return;
  }

  const confidence = confidenceForProduct(product);
  const certs = product.certifications.length ? product.certifications.join(", ") : "Check with supplier";
  const sources = product.sources
    .map((source) => {
      const sourceConfidence = confidenceForSource(source);
      return `- ${source.type} - ${source.name} (${sourceConfidence.label}): ${source.url}`;
    })
    .join("\n");
  const note = state.notes[product.id] || "None added";
  const text = `InduScout procurement brief
Prepared from InduScout beta catalog on ${formatCopyDate()}

Product: ${product.brand} ${product.sku} - ${product.name}
Project: ${projectValue("name", "Unnamed sourcing project")}
Buyer/company: ${projectValue("buyer", "TBC")}
Buyer contact: ${projectValue("contact", "TBC")}
Delivery country: ${projectValue("country", "TBC")}
Target date: ${projectValue("targetDate", "TBC")}
Category: ${product.category}
Family: ${product.family}
Lifecycle: ${product.lifecycle}
${priorityLabel()} fit score: ${product[state.priority]}
Lead time signal: ${product.lead}
MOQ signal: ${product.moq}
Datasheet signal: ${product.datasheet ? "Available" : "Check with supplier"}
Certifications to request: ${certs}

Confidence:
${confidence.label} - ${confidence.reason}

Why this record may fit:
${product.description}

Key specifications:
${product.specs.map((item) => `- ${item}`).join("\n")}

Common applications:
${product.applications.map((item) => `- ${item}`).join("\n")}

Known alternates to review:
${product.alternatives.map((item) => `- ${item}`).join("\n")}

Source paths:
${sources}

Buyer notes:
${note}

Verification checklist before order:
- Confirm exact part number, suffix, voltage, size, material, and configuration.
- Confirm compatibility with installed equipment or project specification.
- Request latest datasheet, certificate, warranty path, and country of origin.
- Confirm stock, price, lead time, payment terms, delivery terms, and seller legitimacy.
- Treat alternates as technical review items, not automatic substitutes.

InduScout is a discovery and RFQ preparation aid. Final purchasing validation remains with the buyer and supplier.`;

  try {
    await navigator.clipboard.writeText(text);
    const button = triggerButton || els.productDetailContent.querySelector("[data-copy-brief]");
    if (button) {
      button.textContent = "Brief copied";
      setTimeout(() => {
        button.textContent = "Copy procurement brief";
      }, 1200);
    }
  } catch {
    window.prompt("Copy procurement brief", text);
  }
}

async function copyDataUpdate(id) {
  const product = products.find((item) => item.id === id);
  if (!product) {
    return;
  }

  const confidence = confidenceForProduct(product);
  const issueType = getFieldValue("#dataIssueType", "Product data update");
  const reporter = getFieldValue("#dataReporterContact", "Not provided");
  const correction = getFieldValue("#dataCorrection", "No correction details added");
  const sources = product.sources.map((source) => `${source.type} - ${source.name}: ${source.url}`).join("; ");
  const text = `InduScout product data update request

Product: ${product.brand} ${product.sku} - ${product.name}
Category: ${product.category}
Current confidence: ${confidence.label}
Issue type: ${issueType}
Reporter/contact: ${reporter}

Suggested correction or evidence:
${correction}

Current specs: ${product.specs.join(", ")}
Current alternates: ${product.alternatives.join(", ")}
Current source links: ${sources}

Please review this record and update source confidence, specifications, alternates, datasheet status, or supplier links if the evidence is valid.`;

  try {
    await navigator.clipboard.writeText(text);
    const button = els.productDetailContent.querySelector("[data-copy-update]");
    if (button) {
      button.textContent = "Update request copied";
      setTimeout(() => {
        button.textContent = "Copy data update request";
      }, 1200);
    }
  } catch {
    window.prompt("Copy data update request", text);
  }
}

async function copySourcePassport(productId, sourceIndex, triggerButton) {
  const product = products.find((item) => item.id === productId);
  const source = product?.sources[sourceIndex];
  if (!product || !source) {
    return;
  }

  await copyPassportText(sourcePassportText(source, product), triggerButton, "Checklist copied", "Copy trust checklist");
}

async function copyDirectorySourcePassport(sourceName, triggerButton) {
  const source = sourceDirectory.find((item) => item.name === sourceName);
  if (!source) {
    return;
  }

  await copyPassportText(sourcePassportText(source), triggerButton, "Checklist copied", "Copy checklist");
}

async function copyPassportText(text, triggerButton, copiedLabel, defaultLabel) {
  try {
    await navigator.clipboard.writeText(text);
    if (triggerButton) {
      triggerButton.textContent = copiedLabel;
      setTimeout(() => {
        triggerButton.textContent = defaultLabel;
      }, 1400);
    }
  } catch {
    window.prompt("Copy supplier trust checklist", text);
  }
}

function sourcePassportText(source, product) {
  const passport = sourceTrustPassport(source);
  const regions = Array.isArray(source.regions) ? source.regions.join(", ") : source.region || "Check with source";
  const bestFor = source.bestFor || source.action || "Supplier/source discovery and buyer verification";
  const productContext = product
    ? `
Product context:
- Product: ${product.brand} ${product.sku} - ${product.name}
- Category: ${product.category}
- Expected lead time signal: ${product.lead}
- MOQ signal: ${product.moq}`
    : "";

  return `InduScout supplier trust passport
Prepared on ${formatCopyDate()}

Source: ${source.name}
Source type: ${source.type}
Trust role: ${passport.role}
Regions: ${regions}
URL: ${source.url}
Best for: ${bestFor}${productContext}

Verification checklist:
${passport.verify.map((item) => `- ${item}`).join("\n")}

Risk notes:
- ${passport.risk}
- Confirm exact part number, compatibility, stock, price, lead time, payment terms, delivery terms, warranty path, certificate availability, and seller legitimacy before ordering.
- Treat alternates as technical review items, not automatic substitutes.

InduScout is a discovery and RFQ preparation aid. Final purchasing validation remains with the buyer and supplier.`;
}

function openShortlist() {
  closeProductDetail();
  renderShortlist();
  els.shortlistDrawer.classList.add("open");
  els.shortlistDrawer.setAttribute("aria-hidden", "false");
  els.scrim.classList.add("open");
}

function closeShortlist() {
  els.shortlistDrawer.classList.remove("open");
  els.shortlistDrawer.setAttribute("aria-hidden", "true");
  if (!els.productDetail.classList.contains("open")) {
    els.scrim.classList.remove("open");
  }
}

function closeProductDetail() {
  state.activeProductId = null;
  els.productDetail.classList.remove("open");
  els.productDetail.setAttribute("aria-hidden", "true");
  if (!els.shortlistDrawer.classList.contains("open")) {
    els.scrim.classList.remove("open");
  }
}

function closeOverlays() {
  closeShortlist();
  closeProductDetail();
}

function setText(element, value) {
  if (element) {
    element.textContent = value;
  }
}

function getFieldValue(selector, fallback) {
  const value = document.querySelector(selector)?.value.trim();
  return value || fallback;
}

function defaultQuantity(moq) {
  const numeric = String(moq).match(/\d+/);
  return numeric ? numeric[0] : "";
}

function csvEscape(value) {
  const text = spreadsheetSafeText(value);
  return `"${text.replace(/"/g, '""')}"`;
}

function createXlsxWorkbook(headers, rows, sheetName = "Shortlist", title = "InduScout Shortlist") {
  const allRows = [headers, ...rows];
  const safeSheetName = String(sheetName || "Sheet1").replace(/[\[\]:*?/\\]/g, " ").trim().slice(0, 31) || "Sheet1";
  const files = [
    {
      path: "[Content_Types].xml",
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
</Types>`
    },
    {
      path: "_rels/.rels",
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>`
    },
    {
      path: "docProps/app.xml",
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
  <Application>InduScout</Application>
</Properties>`
    },
    {
      path: "docProps/core.xml",
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:title>${xmlEscape(title)}</dc:title>
  <dc:creator>InduScout</dc:creator>
  <dcterms:created xsi:type="dcterms:W3CDTF">${new Date().toISOString()}</dcterms:created>
</cp:coreProperties>`
    },
    {
      path: "xl/workbook.xml",
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets><sheet name="${xmlEscape(safeSheetName)}" sheetId="1" r:id="rId1"/></sheets>
</workbook>`
    },
    {
      path: "xl/_rels/workbook.xml.rels",
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`
    },
    {
      path: "xl/styles.xml",
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts>
  <fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FFD9EDEB"/><bgColor indexed="64"/></patternFill></fill></fills>
  <borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>
  <cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
  <cellXfs count="3"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFill="1" applyFont="1" applyAlignment="1"><alignment wrapText="1" vertical="top"/></xf><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyAlignment="1"><alignment wrapText="1" vertical="top"/></xf></cellXfs>
  <cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>
</styleSheet>`
    },
    {
      path: "xl/worksheets/sheet1.xml",
      content: buildWorksheetXml(allRows)
    }
  ];

  return createZip(files);
}

function buildWorksheetXml(rows) {
  const baseWidths = [28, 24, 28, 18, 15, 42, 18, 16, 34, 26, 28, 14, 16, 10, 15, 10, 12, 24, 36, 36, 40, 40, 58, 36, 42];
  const columnWidths = Array.from({ length: rows[0].length }, (_, index) => baseWidths[index] || 24);
  const cols = columnWidths
    .map((width, index) => `<col min="${index + 1}" max="${index + 1}" width="${width}" customWidth="1"/>`)
    .join("");
  const sheetRows = rows
    .map((row, rowIndex) => {
      const cells = row
        .map((value, columnIndex) => {
          const ref = `${columnName(columnIndex + 1)}${rowIndex + 1}`;
          const style = rowIndex === 0 ? 1 : 2;
          return `<c r="${ref}" t="inlineStr" s="${style}"><is><t>${xmlEscape(spreadsheetSafeText(value))}</t></is></c>`;
        })
        .join("");
      return `<row r="${rowIndex + 1}">${cells}</row>`;
    })
    .join("");
  const lastCell = `${columnName(rows[0].length)}${rows.length}`;

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <dimension ref="A1:${lastCell}"/>
  <sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>
  <cols>${cols}</cols>
  <sheetData>${sheetRows}</sheetData>
  <autoFilter ref="A1:${lastCell}"/>
</worksheet>`;
}

function createZip(files) {
  const records = [];
  const centralRecords = [];
  let offset = 0;
  const now = new Date();
  const modTime = ((now.getHours() & 31) << 11) | ((now.getMinutes() & 63) << 5) | ((now.getSeconds() / 2) & 31);
  const modDate = (((now.getFullYear() - 1980) & 127) << 9) | (((now.getMonth() + 1) & 15) << 5) | (now.getDate() & 31);

  files.forEach((file) => {
    const nameBytes = utf8Bytes(file.path);
    const dataBytes = utf8Bytes(file.content);
    const crc = crc32(dataBytes);
    const localHeader = zipLocalHeader(nameBytes, dataBytes.length, crc, modTime, modDate);
    records.push(localHeader, nameBytes, dataBytes);
    centralRecords.push(zipCentralHeader(nameBytes, dataBytes.length, crc, modTime, modDate, offset), nameBytes);
    offset += localHeader.length + nameBytes.length + dataBytes.length;
  });

  const centralSize = centralRecords.reduce((size, item) => size + item.length, 0);
  const endRecord = zipEndRecord(files.length, centralSize, offset);
  return concatBytes([...records, ...centralRecords, endRecord]);
}

function zipLocalHeader(nameBytes, size, crc, modTime, modDate) {
  const bytes = new Uint8Array(30);
  writeUint32(bytes, 0, 0x04034b50);
  writeUint16(bytes, 4, 20);
  writeUint16(bytes, 6, 0x0800);
  writeUint16(bytes, 8, 0);
  writeUint16(bytes, 10, modTime);
  writeUint16(bytes, 12, modDate);
  writeUint32(bytes, 14, crc);
  writeUint32(bytes, 18, size);
  writeUint32(bytes, 22, size);
  writeUint16(bytes, 26, nameBytes.length);
  return bytes;
}

function zipCentralHeader(nameBytes, size, crc, modTime, modDate, offset) {
  const bytes = new Uint8Array(46);
  writeUint32(bytes, 0, 0x02014b50);
  writeUint16(bytes, 4, 20);
  writeUint16(bytes, 6, 20);
  writeUint16(bytes, 8, 0x0800);
  writeUint16(bytes, 10, 0);
  writeUint16(bytes, 12, modTime);
  writeUint16(bytes, 14, modDate);
  writeUint32(bytes, 16, crc);
  writeUint32(bytes, 20, size);
  writeUint32(bytes, 24, size);
  writeUint16(bytes, 28, nameBytes.length);
  writeUint32(bytes, 42, offset);
  return bytes;
}

function zipEndRecord(count, centralSize, centralOffset) {
  const bytes = new Uint8Array(22);
  writeUint32(bytes, 0, 0x06054b50);
  writeUint16(bytes, 8, count);
  writeUint16(bytes, 10, count);
  writeUint32(bytes, 12, centralSize);
  writeUint32(bytes, 16, centralOffset);
  return bytes;
}

function crc32(bytes) {
  let crc = 0xffffffff;
  bytes.forEach((byte) => {
    crc = (crc >>> 8) ^ crc32Table()[(crc ^ byte) & 0xff];
  });
  return (crc ^ 0xffffffff) >>> 0;
}

function crc32Table() {
  if (!crc32Table.cache) {
    crc32Table.cache = Array.from({ length: 256 }, (_, index) => {
      let c = index;
      for (let bit = 0; bit < 8; bit += 1) {
        c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      }
      return c >>> 0;
    });
  }
  return crc32Table.cache;
}

function concatBytes(chunks) {
  const total = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const output = new Uint8Array(total);
  let offset = 0;
  chunks.forEach((chunk) => {
    output.set(chunk, offset);
    offset += chunk.length;
  });
  return output;
}

function utf8Bytes(value) {
  return new TextEncoder().encode(value);
}

function writeUint16(bytes, offset, value) {
  bytes[offset] = value & 0xff;
  bytes[offset + 1] = (value >>> 8) & 0xff;
}

function writeUint32(bytes, offset, value) {
  bytes[offset] = value & 0xff;
  bytes[offset + 1] = (value >>> 8) & 0xff;
  bytes[offset + 2] = (value >>> 16) & 0xff;
  bytes[offset + 3] = (value >>> 24) & 0xff;
}

function columnName(index) {
  let name = "";
  let current = index;
  while (current > 0) {
    const remainder = (current - 1) % 26;
    name = String.fromCharCode(65 + remainder) + name;
    current = Math.floor((current - 1) / 26);
  }
  return name;
}

function xmlEscape(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&apos;"
    };
    return map[character];
  });
}

function safeHref(value, fallback = "#") {
  return escapeHtml(safeExternalUrl(value, fallback));
}

function safeExternalUrl(value, fallback = "#") {
  const raw = String(value || "").trim();
  if (!raw) {
    return fallback;
  }

  try {
    const base = window.location?.href || "https://dhirajnyse.github.io/induscout/";
    const url = new URL(raw, base);
    if (["http:", "https:", "mailto:"].includes(url.protocol)) {
      return url.href;
    }
  } catch {
    return fallback;
  }
  return fallback;
}

function spreadsheetSafeText(value) {
  const text = limitText(String(value ?? ""), 8000);
  const leftTrimmed = text.replace(/^\s+/, "");
  return /^[=+\-@\t\r]/.test(leftTrimmed) ? `'${text}` : text;
}

function cleanText(value, maxLength = 600) {
  return limitText(String(value ?? "").replace(/\u0000/g, ""), maxLength);
}

function limitText(value, maxLength = 600) {
  const text = String(value ?? "");
  return text.length > maxLength ? text.slice(0, maxLength) : text;
}

function parseSessionJson(raw) {
  const text = String(raw || "");
  if (text.length > SESSION_IMPORT_MAX_BYTES) {
    throw new Error("Session JSON exceeds size limit");
  }
  const session = JSON.parse(text);
  if (!session || typeof session !== "object" || Array.isArray(session)) {
    throw new Error("Session JSON must be an object");
  }
  if (session.app && session.app !== "InduScout") {
    throw new Error("Session JSON is not an InduScout session");
  }
  return session;
}

function safeDownloadFilename(filename) {
  return cleanText(filename || "induscout-download", 150)
    .replace(/[<>:"/\\|?*\x00-\x1f]+/g, "-")
    .replace(/\s+/g, " ")
    .trim() || "induscout-download";
}

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = safeDownloadFilename(filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function priorityLabel() {
  if (state.priority === "speed") {
    return "Fastest";
  }
  return `${state.priority.charAt(0).toUpperCase()}${state.priority.slice(1)}`;
}

function safeFilenamePart(value) {
  return String(value || "")
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 54);
}

function formatCopyDate() {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(new Date());
}

function loadNotes() {
  try {
    return JSON.parse(window.localStorage.getItem("induscoutBuyerNotes") || "{}");
  } catch {
    return {};
  }
}

function saveNotes() {
  try {
    window.localStorage.setItem("induscoutBuyerNotes", JSON.stringify(state.notes));
  } catch {
    // Notes are a convenience only; the RFQ still works if storage is blocked.
  }
}

function loadProjectProfile() {
  try {
    return sanitizeProjectProfile(JSON.parse(window.localStorage.getItem("induscoutProjectProfile") || "{}"));
  } catch {
    return defaultProjectProfile();
  }
}

function saveProjectProfile() {
  try {
    window.localStorage.setItem("induscoutProjectProfile", JSON.stringify(state.project));
  } catch {
    // Project context is a convenience only; exports still work if storage is blocked.
  }
}

function loadSpecRequirements() {
  try {
    return sanitizeSpecRequirements(JSON.parse(window.localStorage.getItem("induscoutSpecRequirements") || "{}"));
  } catch {
    return defaultSpecRequirements();
  }
}

function saveSpecRequirements() {
  try {
    window.localStorage.setItem("induscoutSpecRequirements", JSON.stringify(state.specRequirements));
  } catch {
    // Requirement profiles are a convenience only; the matrix still works if storage is blocked.
  }
}

function loadAlternateReview() {
  try {
    return sanitizeAlternateReview(JSON.parse(window.localStorage.getItem("induscoutAlternateReview") || "{}"));
  } catch {
    return defaultAlternateReview();
  }
}

function saveAlternateReview() {
  try {
    window.localStorage.setItem("induscoutAlternateReview", JSON.stringify(state.alternateReview));
  } catch {
    // Alternate review setup is a convenience only; copy/export actions still work if storage is blocked.
  }
}

function loadSubstitutionApproval() {
  try {
    return sanitizeSubstitutionApproval(JSON.parse(window.localStorage.getItem("induscoutSubstitutionApproval") || "{}"));
  } catch {
    return defaultSubstitutionApproval();
  }
}

function saveSubstitutionApproval() {
  try {
    window.localStorage.setItem("induscoutSubstitutionApproval", JSON.stringify(state.substitutionApproval));
  } catch {
    // Substitution approval setup is a convenience only; copy/export actions still work if storage is blocked.
  }
}

function loadLandedCostScenario() {
  try {
    return sanitizeLandedCostScenario(JSON.parse(window.localStorage.getItem("induscoutLandedCostScenario") || "{}"));
  } catch {
    return defaultLandedCostScenario();
  }
}

function saveLandedCostScenario() {
  try {
    window.localStorage.setItem("induscoutLandedCostScenario", JSON.stringify(state.landedCost));
  } catch {
    // Landed cost scenarios are a convenience only; copy/export actions still work if storage is blocked.
  }
}

function loadNegotiationPlan() {
  try {
    return sanitizeNegotiationPlan(JSON.parse(window.localStorage.getItem("induscoutNegotiationPlan") || "{}"));
  } catch {
    return defaultNegotiationPlan();
  }
}

function saveNegotiationPlan() {
  try {
    window.localStorage.setItem("induscoutNegotiationPlan", JSON.stringify(state.negotiationPlan));
  } catch {
    // Negotiation plans are a convenience only; copy/export actions still work if storage is blocked.
  }
}

function sanitizeAlternateReview(record) {
  const source = record && typeof record === "object" && !Array.isArray(record) ? record : {};
  const productId = products.some((product) => product.id === source.productId) ? source.productId : products[0]?.id || "";
  const criticality = ALTERNATE_CRITICALITY_LEVELS.includes(source.criticality) ? source.criticality : "Standard spare";
  return {
    productId,
    criticality,
    equipment: cleanText(source.equipment || "", 220),
    constraint: cleanText(source.constraint || "", 260)
  };
}

function sanitizeSubstitutionApproval(record) {
  const source = record && typeof record === "object" && !Array.isArray(record) ? record : {};
  const fallback = defaultSubstitutionApproval();
  const baseProductId = products.some((product) => product.id === source.baseProductId) ? source.baseProductId : fallback.baseProductId;
  const candidateProductId = products.some((product) => product.id === source.candidateProductId) ? source.candidateProductId : fallback.candidateProductId;
  const decision = APPROVAL_DECISIONS.includes(source.decision) ? source.decision : "Engineering review required";
  const checks = source.checks && typeof source.checks === "object" && !Array.isArray(source.checks) ? source.checks : {};
  return {
    baseProductId,
    candidateProductId,
    decision,
    reviewer: cleanText(source.reviewer || "", 180),
    equipment: cleanText(source.equipment || "", 220),
    notes: cleanText(source.notes || "", 1600),
    checks: {
      model: Boolean(checks.model),
      datasheet: Boolean(checks.datasheet),
      interface: Boolean(checks.interface),
      safety: Boolean(checks.safety),
      supplier: Boolean(checks.supplier)
    }
  };
}

function sanitizeLandedCostScenario(record) {
  const source = record && typeof record === "object" && !Array.isArray(record) ? record : {};
  const fallback = defaultLandedCostScenario();
  const productId = products.some((product) => product.id === source.productId) ? source.productId : fallback.productId;
  const quoteId = cleanText(source.quoteId || "", 90);
  const currency = ["USD", "EUR", "GBP", "AED", "INR", "Other"].includes(source.currency) ? source.currency : "USD";
  return {
    productId,
    quoteId,
    supplier: cleanText(source.supplier || "", 180),
    currency,
    unitPrice: cleanText(source.unitPrice || "", 60),
    quantity: cleanText(source.quantity || fallback.quantity, 80),
    freight: cleanText(source.freight || "0", 60),
    dutyRate: cleanText(source.dutyRate || "0", 30),
    taxRate: cleanText(source.taxRate || "0", 30),
    handling: cleanText(source.handling || "0", 60),
    bankCharges: cleanText(source.bankCharges || "0", 60),
    fxBuffer: cleanText(source.fxBuffer || "0", 30),
    deliveryTerms: cleanText(source.deliveryTerms || "", 180),
    country: cleanText(source.country || "", 120),
    notes: cleanText(source.notes || "", 1800)
  };
}

function sanitizeNegotiationPlan(record) {
  const source = record && typeof record === "object" && !Array.isArray(record) ? record : {};
  const fallback = defaultNegotiationPlan();
  const productId = products.some((product) => product.id === source.productId) ? source.productId : fallback.productId;
  const leverageOptions = [
    "Repeat order potential",
    "Competing quote available",
    "Bundled order opportunity",
    "Project urgency",
    "Budget approval limit",
    "Standard commercial review"
  ];
  return {
    productId,
    quoteId: cleanText(source.quoteId || "", 90),
    supplier: cleanText(source.supplier || "", 180),
    currency: ["USD", "EUR", "GBP", "AED", "INR", "Other"].includes(source.currency) ? source.currency : "USD",
    currentPrice: cleanText(source.currentPrice || "", 60),
    quantity: cleanText(source.quantity || fallback.quantity, 80),
    targetPrice: cleanText(source.targetPrice || "", 60),
    discount: cleanText(source.discount || fallback.discount, 30),
    targetLeadTime: cleanText(source.targetLeadTime || "", 140),
    validity: cleanText(source.validity || fallback.validity, 180),
    leverage: leverageOptions.includes(source.leverage) ? source.leverage : fallback.leverage,
    reason: cleanText(source.reason || fallback.reason, 240),
    notes: cleanText(source.notes || "", 1800)
  };
}

function sanitizeSpecRequirements(record) {
  const source = record && typeof record === "object" && !Array.isArray(record) ? record : {};
  const sourceRequirement = SPEC_SOURCE_REQUIREMENTS.includes(source.sourceRequirement) ? source.sourceRequirement : "any";
  const criticality = SPEC_CRITICALITY_LEVELS.includes(source.criticality) ? source.criticality : "Standard sourcing";
  return {
    application: cleanText(source.application || "", 280),
    mustHave: cleanText(source.mustHave || "", 1400),
    certifications: cleanText(source.certifications || "", 260),
    sourceRequirement,
    criticality
  };
}

function sanitizeProjectProfile(profile) {
  const source = profile && typeof profile === "object" && !Array.isArray(profile) ? profile : {};
  return {
    name: cleanText(source.name || "", 180),
    buyer: cleanText(source.buyer || "", 180),
    contact: cleanText(source.contact || "", 180),
    country: cleanText(source.country || "", 120),
    targetDate: cleanText(source.targetDate || "", 40),
    notes: cleanText(source.notes || "", 1800)
  };
}

function loadProductRequests() {
  try {
    const saved = JSON.parse(window.localStorage.getItem("induscoutProductRequests") || "[]");
    return Array.isArray(saved) ? saved.map(sanitizeProductRequest).filter(Boolean).slice(0, 30) : [];
  } catch {
    return [];
  }
}

function saveProductRequests() {
  try {
    window.localStorage.setItem("induscoutProductRequests", JSON.stringify(state.productRequests));
  } catch {
    // Product requests are a convenience only; copy actions still work if storage is blocked.
  }
}

function loadSourceLeads() {
  try {
    const saved = JSON.parse(window.localStorage.getItem("induscoutSourceLeads") || "[]");
    return Array.isArray(saved) ? saved.map(sanitizeSourceLead).filter(Boolean).slice(0, 120) : [];
  } catch {
    return [];
  }
}

function saveSourceLeads() {
  try {
    window.localStorage.setItem("induscoutSourceLeads", JSON.stringify(state.sourceLeads));
  } catch {
    // Source intake is a convenience only; copy/export actions still work if storage is blocked.
  }
}

function loadLaunchPartners() {
  try {
    const saved = JSON.parse(window.localStorage.getItem("induscoutLaunchPartners") || "[]");
    return Array.isArray(saved) ? saved.map(sanitizeLaunchPartner).filter(Boolean).slice(0, 120) : [];
  } catch {
    return [];
  }
}

function saveLaunchPartners() {
  try {
    window.localStorage.setItem("induscoutLaunchPartners", JSON.stringify(state.launchPartners));
  } catch {
    // Launch partner tracking is a convenience only; copy/export actions still work if storage is blocked.
  }
}

function loadPilotRuns() {
  try {
    const saved = JSON.parse(window.localStorage.getItem("induscoutPilotRuns") || "[]");
    return Array.isArray(saved) ? saved.map(sanitizePilotRun).filter(Boolean).slice(0, 120) : [];
  } catch {
    return [];
  }
}

function savePilotRuns() {
  try {
    window.localStorage.setItem("induscoutPilotRuns", JSON.stringify(state.pilotRuns));
  } catch {
    // Pilot ops tracking is a convenience only; copy/export actions still work if storage is blocked.
  }
}

function loadBackendFoundation() {
  try {
    return sanitizeBackendFoundation(JSON.parse(window.localStorage.getItem("induscoutBackendFoundation") || "{}"));
  } catch {
    return defaultBackendFoundation();
  }
}

function saveBackendFoundation() {
  try {
    window.localStorage.setItem("induscoutBackendFoundation", JSON.stringify(state.backendFoundation));
  } catch {
    // Foundation planning is a convenience only; copy/export actions still work if storage is blocked.
  }
}

function loadQuoteRecords() {
  try {
    const saved = JSON.parse(window.localStorage.getItem("induscoutQuoteRecords") || "[]");
    return Array.isArray(saved) ? saved.map(sanitizeQuoteRecord).filter(Boolean).slice(0, 80) : [];
  } catch {
    return [];
  }
}

function saveQuoteRecords() {
  try {
    window.localStorage.setItem("induscoutQuoteRecords", JSON.stringify(state.quotes));
  } catch {
    // Quote tracking is a convenience only; copy/export actions still work if storage is blocked.
  }
}

function loadSavingsRecords() {
  try {
    const saved = JSON.parse(window.localStorage.getItem("induscoutSavingsRecords") || "[]");
    return Array.isArray(saved) ? saved.map(sanitizeSavingsRecord).filter(Boolean).slice(0, 120) : [];
  } catch {
    return [];
  }
}

function saveSavingsRecords() {
  try {
    window.localStorage.setItem("induscoutSavingsRecords", JSON.stringify(state.savingsRecords));
  } catch {
    // Savings tracking is a convenience only; copy/export actions still work if storage is blocked.
  }
}

function loadLearningRecords() {
  try {
    const saved = JSON.parse(window.localStorage.getItem("induscoutLearningRecords") || "[]");
    return Array.isArray(saved) ? saved.map(sanitizeLearningRecord).filter(Boolean).slice(0, 160) : [];
  } catch {
    return [];
  }
}

function saveLearningRecords() {
  try {
    window.localStorage.setItem("induscoutLearningRecords", JSON.stringify(state.learningRecords));
  } catch {
    // Learning records are a convenience only; copy/export actions still work if storage is blocked.
  }
}

function loadPlaybookConfig() {
  try {
    return sanitizePlaybookConfig(JSON.parse(window.localStorage.getItem("induscoutPlaybookConfig") || "{}"));
  } catch {
    return defaultPlaybookConfig();
  }
}

function savePlaybookConfig() {
  try {
    window.localStorage.setItem("induscoutPlaybookConfig", JSON.stringify(state.playbookConfig));
  } catch {
    // Playbook settings are a convenience only; generated recommendations still work if storage is blocked.
  }
}

function loadPlaybookRules() {
  try {
    const saved = JSON.parse(window.localStorage.getItem("induscoutPlaybookRules") || "[]");
    return Array.isArray(saved) ? saved.map(sanitizePlaybookRule).filter(Boolean).slice(0, 120) : [];
  } catch {
    return [];
  }
}

function savePlaybookRules() {
  try {
    window.localStorage.setItem("induscoutPlaybookRules", JSON.stringify(state.playbookRules));
  } catch {
    // Playbook rules are a convenience only; copy/export actions still work if storage is blocked.
  }
}

function loadReinforcementSignals() {
  try {
    const saved = JSON.parse(window.localStorage.getItem("induscoutReinforcementSignals") || "[]");
    return Array.isArray(saved) ? saved.map(sanitizeReinforcementSignal).filter(Boolean).slice(0, 220) : [];
  } catch {
    return [];
  }
}

function saveReinforcementSignals() {
  try {
    window.localStorage.setItem("induscoutReinforcementSignals", JSON.stringify(state.reinforcementSignals));
  } catch {
    // Reinforcement signals are a convenience only; copy/export actions still work if storage is blocked.
  }
}

function defaultGovernancePolicy() {
  return {
    boundary: "Local browser only",
    evidence: "Verified source + outcome",
    commercial: "Never share raw commercial terms",
    personal: "Strip contacts and buyer notes"
  };
}

function loadGovernancePolicy() {
  try {
    return sanitizeGovernancePolicy(JSON.parse(window.localStorage.getItem("induscoutGovernancePolicy") || "{}"));
  } catch {
    return defaultGovernancePolicy();
  }
}

function saveGovernancePolicy() {
  try {
    window.localStorage.setItem("induscoutGovernancePolicy", JSON.stringify(state.governancePolicy));
  } catch {
    // Governance policy is a convenience only; summaries still render with default guardrails.
  }
}

function loadLearningApprovals() {
  try {
    return sanitizeLearningApprovals(JSON.parse(window.localStorage.getItem("induscoutLearningApprovals") || "{}"));
  } catch {
    return {};
  }
}

function saveLearningApprovals() {
  try {
    window.localStorage.setItem("induscoutLearningApprovals", JSON.stringify(state.learningApprovals));
  } catch {
    // Learning approval decisions are local-only until a governed SaaS backend exists.
  }
}

function sanitizeNotes(notes, validProductIds = new Set(products.map((product) => product.id))) {
  if (!notes || typeof notes !== "object" || Array.isArray(notes)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(notes)
      .filter(([id]) => validProductIds.has(id))
      .map(([id, note]) => [id, cleanText(note, 1500)])
      .filter(([, note]) => note.trim())
  );
}

function sanitizeProductRequest(record) {
  if (!record || typeof record !== "object") {
    return null;
  }

  const fallbackPart = cleanText(record.part || "TBC", 180);
  return {
    id: cleanText(record.id || `${Date.now()}-${safeFilenamePart(fallbackPart) || "request"}`, 90),
    savedAt: cleanText(record.savedAt || new Date().toISOString(), 40),
    part: fallbackPart,
    brand: cleanText(record.brand || "TBC", 120),
    category: cleanText(record.category || "Not sure", 120),
    country: cleanText(record.country || "TBC", 120),
    urgency: cleanText(record.urgency || "Standard sourcing", 80),
    quantity: cleanText(record.quantity || "TBC", 80),
    notes: cleanText(record.notes || "No extra notes added", 1500),
    query: cleanText(record.query || "None", 180),
    filters: {
      category: cleanText(record.filters?.category || "All categories", 120),
      region: cleanText(record.filters?.region || "Global", 120),
      sourceType: cleanText(record.filters?.sourceType || "All source types", 120),
      confidence: cleanText(record.filters?.confidence || "All confidence levels", 120)
    }
  };
}

function sanitizeSourceLead(record) {
  if (!record || typeof record !== "object") {
    return null;
  }

  const allowedStatuses = ["New lead", "Needs verification", "Evidence supplied", "Authorized claim", "Buyer proven"];
  const allowedTypes = ["Distributor", "OEM", "Marketplace", "RFQ network", "Surplus", "Data directory", "Local supplier"];
  const fallbackName = cleanText(record.name || "Source TBC", 180);
  return {
    id: cleanText(record.id || `${Date.now()}-${safeFilenamePart(fallbackName) || "source-lead"}`, 90),
    savedAt: cleanText(record.savedAt || new Date().toISOString(), 40),
    updatedAt: cleanText(record.updatedAt || record.savedAt || new Date().toISOString(), 40),
    name: fallbackName,
    website: cleanText(safeExternalUrl(record.website || "", ""), 240),
    type: allowedTypes.includes(record.type) ? record.type : "Distributor",
    category: cleanText(record.category || "Multiple categories", 140),
    region: cleanText(record.region || "", 180),
    evidenceUrl: cleanText(safeExternalUrl(record.evidenceUrl || "", ""), 240),
    contact: cleanText(record.contact || "", 180),
    status: allowedStatuses.includes(record.status) ? record.status : "New lead",
    notes: cleanText(record.notes || "", 1800)
  };
}

function sanitizeLaunchPartner(record) {
  if (!record || typeof record !== "object") {
    return null;
  }

  const allowedSegments = ["Procurement team", "MRO distributor", "OEM partner", "System integrator", "Technology partner", "Investor / advisor"];
  const allowedStatuses = ["Target", "Contacted", "Demo booked", "Pilot proposed", "Pilot active", "Converted", "Not now"];
  const allowedFits = ["High strategic fit", "Moderate fit", "Needs qualification", "Not a fit"];
  const fallbackCompany = cleanText(record.company || "Partner TBC", 180);
  return {
    id: cleanText(record.id || `${Date.now()}-${safeFilenamePart(fallbackCompany) || "launch-partner"}`, 90),
    savedAt: cleanText(record.savedAt || new Date().toISOString(), 40),
    updatedAt: cleanText(record.updatedAt || record.savedAt || new Date().toISOString(), 40),
    company: fallbackCompany,
    contact: cleanText(record.contact || "", 220),
    segment: allowedSegments.includes(record.segment) ? record.segment : "Procurement team",
    region: cleanText(record.region || "", 160),
    pilotLane: cleanText(record.pilotLane || record.lane || "", 180),
    status: allowedStatuses.includes(record.status) ? record.status : "Target",
    fit: allowedFits.includes(record.fit) ? record.fit : "High strategic fit",
    nextDate: cleanText(record.nextDate || "", 40),
    notes: cleanText(record.notes || "", 1800)
  };
}

function sanitizePilotRun(record) {
  if (!record || typeof record !== "object") {
    return null;
  }

  const allowedStages = ["Planned", "Kickoff booked", "In progress", "Evidence review", "Completed", "Converted", "Paused"];
  const allowedRisks = ["Low risk", "Missing buyer time", "Needs source evidence", "Needs workflow proof", "Security review needed", "Commercial blocker"];
  const fallbackLane = cleanText(record.lane || "Pilot lane TBC", 180);
  return {
    id: cleanText(record.id || `${Date.now()}-${safeFilenamePart(fallbackLane) || "pilot-run"}`, 90),
    savedAt: cleanText(record.savedAt || new Date().toISOString(), 40),
    updatedAt: cleanText(record.updatedAt || record.savedAt || new Date().toISOString(), 40),
    partnerId: cleanText(record.partnerId || "", 90),
    partnerName: cleanText(record.partnerName || "", 180),
    lane: fallbackLane,
    stage: allowedStages.includes(record.stage) ? record.stage : "Planned",
    owner: cleanText(record.owner || "", 160),
    startDate: cleanText(record.startDate || "", 40),
    targetDate: cleanText(record.targetDate || "", 40),
    successMetric: cleanText(record.successMetric || "", 240),
    risk: allowedRisks.includes(record.risk) ? record.risk : "Low risk",
    outcome: cleanText(record.outcome || "", 1800),
    notes: cleanText(record.notes || "", 2200)
  };
}

function sanitizeBackendFoundation(record) {
  const base = defaultBackendFoundation();
  if (!record || typeof record !== "object") {
    return base;
  }

  const identityOptions = ["Not started", "Role map drafted", "Organization accounts designed", "SSO-ready plan"];
  const dataOptions = ["Local-only beta", "Tenant schema drafted", "Encryption and backups planned", "Deletion workflow approved"];
  const auditOptions = ["Preview only", "Event taxonomy drafted", "Retention rules planned", "Immutable log design ready"];
  const opsOptions = ["Not started", "Support owner named", "Incident runbook drafted", "Monitoring and backup plan ready"];
  const learningOptions = ["Local only", "Tenant-only rules drafted", "Opt-in anonymization design", "DPA and consent review ready"];
  const deploymentOptions = ["Architecture discovery", "Private API sandbox", "Controlled tenant beta", "Production SaaS"];

  return {
    identity: identityOptions.includes(record.identity) ? record.identity : base.identity,
    dataModel: dataOptions.includes(record.dataModel) ? record.dataModel : base.dataModel,
    audit: auditOptions.includes(record.audit) ? record.audit : base.audit,
    ops: opsOptions.includes(record.ops) ? record.ops : base.ops,
    learning: learningOptions.includes(record.learning) ? record.learning : base.learning,
    deployment: deploymentOptions.includes(record.deployment) ? record.deployment : base.deployment,
    owner: cleanText(record.owner || "", 180),
    targetDate: cleanText(record.targetDate || "", 40),
    notes: cleanText(record.notes || "", 2200)
  };
}

function loadSupplierReplies() {
  try {
    const saved = JSON.parse(window.localStorage.getItem("induscoutSupplierReplies") || "[]");
    return Array.isArray(saved) ? saved.map(sanitizeSupplierReply).filter(Boolean).slice(0, 120) : [];
  } catch {
    return [];
  }
}

function saveSupplierReplies() {
  try {
    window.localStorage.setItem("induscoutSupplierReplies", JSON.stringify(state.supplierReplies));
  } catch {
    // Supplier reply tracking is a convenience only; copy/export actions still work if storage is blocked.
  }
}

function sanitizeQuoteRecord(record) {
  if (!record || typeof record !== "object") {
    return null;
  }

  const product = products.find((item) => item.id === record.productId) || products.find((item) => item.sku === record.sku) || products[0];
  return {
    id: cleanText(record.id || `${Date.now()}-${safeFilenamePart(record.supplier || product?.sku || "quote")}`, 90),
    savedAt: cleanText(record.savedAt || new Date().toISOString(), 40),
    updatedAt: cleanText(record.updatedAt || record.savedAt || new Date().toISOString(), 40),
    projectName: cleanText(record.projectName || "", 180),
    buyer: cleanText(record.buyer || "", 180),
    buyerContact: cleanText(record.buyerContact || "", 180),
    deliveryCountry: cleanText(record.deliveryCountry || "", 120),
    targetDate: cleanText(record.targetDate || "", 40),
    productId: product?.id || cleanText(record.productId || "", 90),
    brand: cleanText(record.brand || product?.brand || "", 120),
    sku: cleanText(record.sku || product?.sku || "", 120),
    productName: cleanText(record.productName || product?.name || "", 180),
    category: cleanText(record.category || product?.category || "", 120),
    supplier: cleanText(record.supplier || "Supplier TBC", 180),
    status: ["Requested", "Received", "Follow-up needed", "Best option", "Rejected"].includes(record.status) ? record.status : "Requested",
    currency: cleanText(record.currency || "USD", 12),
    unitPrice: cleanText(record.unitPrice || "", 60),
    quantity: cleanText(record.quantity || "", 80),
    leadTime: cleanText(record.leadTime || product?.lead || "", 120),
    moq: cleanText(record.moq || product?.moq || "", 80),
    paymentTerms: cleanText(record.paymentTerms || "", 180),
    deliveryTerms: cleanText(record.deliveryTerms || "", 180),
    validUntil: cleanText(record.validUntil || "", 40),
    sourceUrl: safeExternalUrl(record.sourceUrl || product?.sources[0]?.url || "", ""),
    notes: cleanText(record.notes || "", 1800)
  };
}

function sanitizeSavingsRecord(record) {
  if (!record || typeof record !== "object") {
    return null;
  }

  const product = products.find((item) => item.id === record.productId) || products.find((item) => item.sku === record.sku) || products[0];
  const allowedStatuses = ["Target set", "Supplier pending", "Partially accepted", "Accepted", "Rejected"];
  const allowedCurrencies = ["USD", "EUR", "GBP", "AED", "INR", "Other"];
  return {
    id: cleanText(record.id || `${Date.now()}-${safeFilenamePart(record.supplier || product?.sku || "savings")}`, 90),
    savedAt: cleanText(record.savedAt || new Date().toISOString(), 40),
    updatedAt: cleanText(record.updatedAt || record.savedAt || new Date().toISOString(), 40),
    projectName: cleanText(record.projectName || "", 180),
    buyer: cleanText(record.buyer || "", 180),
    buyerContact: cleanText(record.buyerContact || "", 180),
    deliveryCountry: cleanText(record.deliveryCountry || "", 120),
    targetDate: cleanText(record.targetDate || "", 40),
    productId: product?.id || cleanText(record.productId || "", 90),
    quoteId: cleanText(record.quoteId || "", 90),
    brand: cleanText(record.brand || product?.brand || "", 120),
    sku: cleanText(record.sku || product?.sku || "", 120),
    productName: cleanText(record.productName || product?.name || "", 180),
    category: cleanText(record.category || product?.category || "", 120),
    supplier: cleanText(record.supplier || "Supplier TBC", 180),
    currency: allowedCurrencies.includes(record.currency) ? record.currency : "USD",
    baselineUnit: cleanText(record.baselineUnit || "", 60),
    finalUnit: cleanText(record.finalUnit || "", 60),
    quantity: cleanText(record.quantity || "1", 80),
    status: allowedStatuses.includes(record.status) ? record.status : "Target set",
    owner: cleanText(record.owner || "", 180),
    evidenceUrl: cleanEvidenceReference(record.evidenceUrl || ""),
    decisionDate: cleanText(record.decisionDate || "", 40),
    notes: cleanText(record.notes || "", 1800)
  };
}

function sanitizeLearningRecord(record) {
  if (!record || typeof record !== "object") {
    return null;
  }

  const product = products.find((item) => item.id === record.productId) || products.find((item) => item.sku === record.sku) || products[0];
  const allowedOutcomes = ["RFQ won", "PO placed", "Quote lost", "No bid", "Supplier rejected", "Pending review"];
  const allowedConfidence = ["Proven pattern", "Useful signal", "Needs review", "Do not repeat"];
  const allowedPatterns = [
    "Authorized path",
    "Fastest valid source",
    "Best landed cost",
    "Alternate accepted",
    "Certificate gap",
    "Supplier responsiveness",
    "No-stock risk",
    "Manual lesson"
  ];
  return {
    id: cleanText(record.id || `${Date.now()}-${safeFilenamePart(record.supplier || product?.sku || "learning")}`, 90),
    savedAt: cleanText(record.savedAt || new Date().toISOString(), 40),
    updatedAt: cleanText(record.updatedAt || record.savedAt || new Date().toISOString(), 40),
    projectName: cleanText(record.projectName || "", 180),
    buyer: cleanText(record.buyer || "", 180),
    buyerContact: cleanText(record.buyerContact || "", 180),
    deliveryCountry: cleanText(record.deliveryCountry || "", 120),
    targetDate: cleanText(record.targetDate || "", 40),
    productId: product?.id || cleanText(record.productId || "", 90),
    brand: cleanText(record.brand || product?.brand || "", 120),
    sku: cleanText(record.sku || product?.sku || "", 120),
    productName: cleanText(record.productName || product?.name || "", 180),
    category: cleanText(record.category || product?.category || "", 120),
    supplier: cleanText(record.supplier || product?.sources?.[0]?.name || "Supplier TBC", 180),
    outcome: allowedOutcomes.includes(record.outcome) ? record.outcome : "Pending review",
    cycleTime: cleanText(record.cycleTime || "", 80),
    savingsValue: cleanText(record.savingsValue || "", 140),
    confidence: allowedConfidence.includes(record.confidence) ? record.confidence : "Useful signal",
    pattern: allowedPatterns.includes(record.pattern) ? record.pattern : "Manual lesson",
    lesson: cleanText(record.lesson || "", 1800),
    recommendation: cleanText(record.recommendation || "", 1800)
  };
}

function sanitizePlaybookConfig(config) {
  const defaults = defaultPlaybookConfig();
  if (!config || typeof config !== "object" || Array.isArray(config)) {
    return defaults;
  }

  const allowedGoals = ["Balanced procurement", "Fastest reliable source", "Lowest landed cost", "Risk-controlled award", "Stock recovery"];
  const allowedEvidence = ["Standard evidence", "Strict verification", "Audit-ready only"];
  const allowedScopes = ["Local organization only", "Future anonymized network-ready", "Supplier-specific review"];
  return {
    goal: allowedGoals.includes(config.goal) ? config.goal : defaults.goal,
    evidence: allowedEvidence.includes(config.evidence) ? config.evidence : defaults.evidence,
    scope: allowedScopes.includes(config.scope) ? config.scope : defaults.scope
  };
}

function sanitizePlaybookRule(rule) {
  if (!rule || typeof rule !== "object") {
    return null;
  }

  const allowedTypes = ["learning", "supplier", "cost", "risk", "reinforcement", "starter"];
  const cleanEvidence = Array.isArray(rule.evidence) ? rule.evidence.map((item) => cleanText(item, 220)).filter(Boolean).slice(0, 8) : [];
  const config = sanitizePlaybookConfig({
    goal: rule.goal,
    evidence: rule.evidenceMode,
    scope: rule.learningBoundary
  });
  return {
    id: cleanText(rule.id || `${Date.now()}-${safeFilenamePart(rule.title || "playbook-rule")}`, 100),
    savedAt: cleanText(rule.savedAt || new Date().toISOString(), 40),
    updatedAt: cleanText(rule.updatedAt || rule.savedAt || new Date().toISOString(), 40),
    sourceRecommendationId: cleanText(rule.sourceRecommendationId || "", 120),
    type: allowedTypes.includes(rule.type) ? rule.type : "learning",
    title: cleanText(rule.title || "Sourcing playbook rule", 180),
    scope: cleanText(rule.scope || "Procurement workflow", 180),
    trigger: cleanText(rule.trigger || "", 600),
    action: cleanText(rule.action || "", 900),
    why: cleanText(rule.why || "", 900),
    guardrail: cleanText(rule.guardrail || "", 900),
    evidence: cleanEvidence,
    category: cleanText(rule.category || "", 140),
    supplier: cleanText(rule.supplier || "", 180),
    score: Math.max(1, Math.min(100, Math.round(Number(rule.score) || 50))),
    goal: config.goal,
    evidenceMode: config.evidence,
    learningBoundary: config.scope
  };
}

function sanitizeGovernancePolicy(policy) {
  const defaults = defaultGovernancePolicy();
  if (!policy || typeof policy !== "object" || Array.isArray(policy)) {
    return defaults;
  }

  const allowedBoundaries = ["Local browser only", "Tenant-only learning", "Opt-in anonymized network"];
  const allowedEvidence = ["Buyer reviewed", "Verified source + outcome", "Audit-ready only"];
  const allowedCommercial = ["Never share raw commercial terms", "Tenant aggregate only", "Anonymized benchmark bands"];
  const allowedPersonal = ["Strip contacts and buyer notes", "Tenant-only authorized users", "Block from learning datasets"];
  return {
    boundary: allowedBoundaries.includes(policy.boundary) ? policy.boundary : defaults.boundary,
    evidence: allowedEvidence.includes(policy.evidence) ? policy.evidence : defaults.evidence,
    commercial: allowedCommercial.includes(policy.commercial) ? policy.commercial : defaults.commercial,
    personal: allowedPersonal.includes(policy.personal) ? policy.personal : defaults.personal
  };
}

function sanitizeLearningApprovals(approvals) {
  if (!approvals || typeof approvals !== "object" || Array.isArray(approvals)) {
    return {};
  }

  const allowedStatuses = ["Approved", "Tenant only", "Blocked", "Needs review"];
  return Object.fromEntries(
    Object.entries(approvals)
      .slice(0, 400)
      .map(([id, approval]) => {
        const source = approval && typeof approval === "object" && !Array.isArray(approval) ? approval : {};
        const status = allowedStatuses.includes(source.status) ? source.status : "Needs review";
        return [
          cleanText(id, 140),
          {
            status,
            decidedAt: cleanText(source.decidedAt || "", 40),
            decisionNote: cleanText(source.decisionNote || "", 300)
          }
        ];
      })
      .filter(([id]) => id)
  );
}

function sanitizeReinforcementSignal(record) {
  if (!record || typeof record !== "object") {
    return null;
  }

  const product = products.find((item) => item.id === record.productId) || products.find((item) => item.sku === record.sku) || products[0];
  const allowedModules = ["Finder", "Compare", "RFQ builder", "Quotes", "Negotiation", "Savings", "Learning", "Playbooks", "Supplier inbox"];
  const allowedFeedback = ["Promote recommendation", "Keep neutral", "Penalize recommendation"];
  const allowedOutcomes = ["Better match", "Faster supplier", "Lower landed cost", "Risk avoided", "Supplier failed", "Wrong product", "Missing evidence", "Pending outcome"];
  const allowedImpacts = ["Speed", "Cost", "Risk", "Quality", "Availability", "Compliance", "UX signal"];
  const allowedEvidence = ["Buyer judgement", "RFQ result", "Quote response", "PO placed", "Supplier reply", "Savings record", "Manual review"];
  const allowedConfidence = ["Observed outcome", "Strong buyer signal", "Weak signal", "Needs validation"];
  return {
    id: cleanText(record.id || `${Date.now()}-${safeFilenamePart(record.impact || product?.sku || "signal")}`, 100),
    savedAt: cleanText(record.savedAt || new Date().toISOString(), 40),
    updatedAt: cleanText(record.updatedAt || record.savedAt || new Date().toISOString(), 40),
    projectName: cleanText(record.projectName || "", 180),
    buyer: cleanText(record.buyer || "", 180),
    buyerContact: cleanText(record.buyerContact || "", 180),
    deliveryCountry: cleanText(record.deliveryCountry || "", 120),
    targetDate: cleanText(record.targetDate || "", 40),
    productId: product?.id || cleanText(record.productId || "", 90),
    brand: cleanText(record.brand || product?.brand || "", 120),
    sku: cleanText(record.sku || product?.sku || "", 120),
    productName: cleanText(record.productName || product?.name || "", 180),
    category: cleanText(record.category || product?.category || "", 120),
    module: allowedModules.includes(record.module) ? record.module : "Finder",
    feedback: allowedFeedback.includes(record.feedback) ? record.feedback : "Keep neutral",
    outcome: allowedOutcomes.includes(record.outcome) ? record.outcome : "Pending outcome",
    impact: allowedImpacts.includes(record.impact) ? record.impact : "Risk",
    evidence: allowedEvidence.includes(record.evidence) ? record.evidence : "Buyer judgement",
    confidence: allowedConfidence.includes(record.confidence) ? record.confidence : "Needs validation",
    note: cleanText(record.note || "", 1800)
  };
}

function cleanEvidenceReference(value) {
  const raw = cleanText(value || "", 260).trim();
  if (!raw) {
    return "";
  }
  if (/^[a-z][a-z0-9+.-]*:/i.test(raw)) {
    return cleanText(safeExternalUrl(raw, ""), 260);
  }
  return raw;
}

function sanitizeSupplierReply(record) {
  if (!record || typeof record !== "object") {
    return null;
  }

  const product = products.find((item) => item.id === record.productId) || products.find((item) => item.sku === record.sku) || products[0];
  const status = replyStatuses().includes(record.status) ? record.status : "Received";
  const nextAction = replyActions().includes(record.nextAction) ? record.nextAction : defaultReplyAction(status);
  const quoteId = cleanText(record.quoteId || "", 90);
  const productId = product?.id || cleanText(record.productId || "", 90);
  return {
    id: cleanText(record.id || `${Date.now()}-supplier-reply`, 90),
    savedAt: cleanText(record.savedAt || new Date().toISOString(), 40),
    updatedAt: cleanText(record.updatedAt || record.savedAt || new Date().toISOString(), 40),
    projectName: cleanText(record.projectName || "", 180),
    buyer: cleanText(record.buyer || "", 180),
    buyerContact: cleanText(record.buyerContact || "", 180),
    deliveryCountry: cleanText(record.deliveryCountry || "", 120),
    targetDate: cleanText(record.targetDate || "", 40),
    itemRef: cleanText(record.itemRef || (quoteId ? `quote:${quoteId}` : productId ? `product:${productId}` : ""), 120),
    quoteId,
    productId,
    brand: cleanText(record.brand || product?.brand || "", 120),
    sku: cleanText(record.sku || product?.sku || "", 120),
    productName: cleanText(record.productName || product?.name || "", 180),
    category: cleanText(record.category || product?.category || "", 120),
    supplier: cleanText(record.supplier || product?.sources[0]?.name || "Supplier TBC", 180),
    status,
    nextAction,
    receivedDate: cleanText(record.receivedDate || "", 40),
    subject: cleanText(record.subject || "", 220),
    message: cleanText(record.message || "", 1800),
    notes: cleanText(record.notes || "", 1500)
  };
}

function replyStatuses() {
  return [
    "Received",
    "Clarification needed",
    "Missing certificate",
    "Price revised",
    "Alternate offered",
    "Awaiting buyer reply",
    "Closed"
  ];
}

function replyActions() {
  return [
    "Request revised quote",
    "Ask for datasheet / certificate",
    "Confirm stock and lead time",
    "Review alternate",
    "Update quote tracker",
    "Close thread"
  ];
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    };
    return map[character];
  });
}

init();
