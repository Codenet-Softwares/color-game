class stringConst {
  constructor() {
    this.Admin = 'admin';
    this.subAdmin = 'subAdmin'; 
    this.User = 'user'; 
    this.superAdmin ='superAdmin'
    this.whiteLabel = 'whiteLabel';
    this.hyperAgent = 'hyperAgent';
    this.superAgent = 'superAgent';
    this.masterAgent = 'masterAgent';
    this.subHyperAgent = 'subHyperAgent';
    this.subSuperAgent = 'subSuperAgent';
    this.subMasterAgent = 'subMasterAgent';
    this.subWhiteLabel = 'subWhiteLabel';
  }
}

class apiPermissions  {
  constructor(){
    this.resultAnnouncement='resultAnnouncement'
  }
}


class statusPanelCode {
  constructor() {
    this.void = 400322;
    this.announcement = 40030;
    this.suspend = 400319;
   
  }
}

export const string = new stringConst();
export const subAdminPermissions= new apiPermissions()
export const statusPanelCodes = new statusPanelCode();

