class stringConst {
  constructor() {
    this.Admin = 'admin';
    this.subAdmin = 'subAdmin'; 
    this.User = 'user'; 
    this.whiteLabel = 'whiteLabel';
    this.hyperAgent = 'hyperAgent';
    this.superAgent = 'superAgent';
    this.masterAgent = 'masterAgent';
  }
}

class apiPermissions  {
  constructor(){
    this.gameView ='gameView',
    this.marketView = 'marketView',
    this.runnerView = 'runnerView',
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

