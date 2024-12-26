import React from 'react';
import AppDrawer from '../common/appDrawer';
import Layout from '../layout/layout';

const RulesPage = () => {
  function getRules() {
    return (
      <>
        <div className="rulesPage">
          <div className="Rules">
            <b>RULES</b>
          </div>
          <br />
          <h5 className="toppara">
            PLEASE READ OUR RULES BEFORE PLACING BET ** ONCE OUR EXCHANGE GIVE USERNAME AND PASSWORD, IT IS YOUR
            RESPONSIBILITY TO CHANGE THE PASSWORD:-
          </h5>
          <br />
          <div>
            <b className="subpara">1 SCORECARD RULES: -</b>

            <p className="para">
              1.1) Live scores and other data on this site is sourced from third party feeds and may be subject to time
              delays and/or be inaccurate. If you rely on this data to place bets, you do so at your own risk. Our
              exchange does not accept responsibility for loss suffered as a result of reliance on this data.
            </p>
            <p className="para">1.2) If Any Dispute in Fancy Results, then the Company Decision Will be Final.</p>
          </div>
          <b className="subpara">2 CHEAT RULES: -</b>
          <p className="para">
            2.1) In Betfair & Fancy markets, If anyone is suspected using ground commentary or ground line or
            courtsiding(being in ground while betting), company will void all winning bets(without providing any proof).
            This is a zero tolerance policy and no arguments will be entertained. The bets will be voided after the
            match is completed. Company's decision will be final decision.
          </p>
          <b className="subpara">3 MATCH ODDS RULES: -</b>
          <p className="para">3.1) Cricket: We will follow Betfair result.</p>
          <p className="para">3.2) Soccer: We will follow Betfair result.</p>
          <p className="para">3.3) Tennis: We will follow Betfair result.</p>
          <p className="para">
            3.4) IF Any Client Found Hedging Or Doing Manipulation in Any Match Odds, then company has the right to Void
            the Bets.
          </p>
          <p className="para">
            3.5) If Exchange resettle any bets or Markets due to wrong Result Declaration or any other reason & if the
            Player has lost Money or If Player gets Negative Balance, In this case Company will do the Settlement from
            Agent for the same, all decision will be Full And Final, No Arguments will be listened.
          </p>
          <p className="para">
            3.6) Company reserves the right to void any bets (only winning bets) of any event at any point of the match
            if the company believes there is any cheating/wrong doing in that particular event by the players (either
            batsman/bowler)
          </p>
          <p className="para">
            3.7) If there is a super over then the match odds of the Super Over will be settled after the Final result
            of winner team is declared but in case of Bookmaker we will Settle or Void the Particular super over
            Bookmaker Based upon that Particular Markets Result
          </p>
          <b className="subpara">4 BOOK-MAKER MARKET RULES: -</b>
          <p className="para">
            4.1) Due to any reason any team will be getting advantage or disadvantage we are not concerned.
          </p>
          <p className="para">4.2) Wrong team selection by our mistake all back and lays bets will be deleted.</p>
          <p className="para">4.3) wrong rate bets also voided.</p>
          <p className="para">
            4.4) If Exchange resettle any bets or Markets due to wrong Result Declaration or any other reason & if the
            Player has lost Money or If Player gets Negative Balance, In this case Company will do the Settlement from
            Agent for the same, all decision will be Full And Final, No Arguments will be listened.
          </p>
          <p className="para">
            4.5) Company reserves the right to void any bets (only winning bets) of any event at any point of the match
            if the company believes there is any cheating/wrong doing in that particular event by the players (either
            batsman/bowler)
          </p>
          <b className="subpara">5 FANCY:- -</b>
          <p className="para">
            5.1) Advance fancy: - Advance Session, Player Runs and all Fancy Bets are only valid for 20 Over/50 over
            full match each side. (Please Note this condition is applied only in case of Advance Fancy Bets only).
          </p>
          <p className="para">
            5.2) All advance fancy bets market will be suspended 60 mins prior to match and will be settled.
          </p>
          <p className="para">5.3) Advance session and Lambi 1st inning valid only.</p>
          <p className="para">
            5.4) Total match playing over adv: - We Will Settle this Market after Whole Match gets Completed.
          </p>
          <p className="para">
            5.5) Criteria: - We Will Count Only Round- Off Over For Both the Innings While Settling (For Ex: - If 1st
            Batting team gets all out at 17.3, 18.4 or 19.5 we Will Count Such Overs as 17, 18 and 19 Respectively and
            if Match gets Ended at 17.2, 18.3 or 19.3 Overs then we will Count that as 17, 18 and 19 Over
            Respectively... and this Will Remain Same For Both the Innings.
          </p>
          <p className="para">5.6) In Case of Rain or if Over gets Reduced then this Market will get Voided.</p>
          <p className="para">
            5.7) 3 Wkt or more by bowler in match adv:- We Will Settle this Market after Whole Match gets Completed.
          </p>
          <p className="para">
            5.8) Once all session/fancy bets are completed and settled there will be no reversal even if the Match is
            Tied or is Abandoned.
          </p>
          <p className="para">
            5.9) Under the rules of Session/Fancy Bets if a market gets Suspended for any reason whatsoever and does not
            resume then all previous Bets will remain Valid and become HAAR/JEET bets.
          </p>
          <p className="para">
            5.10) Incomplete Session/Fancy Bet will be cancelled but Complete Session will be settled.
          </p>
          <p className="para">
            5.11) In the case of Running Match getting Cancelled/ No Result/ Abandoned but the session is complete it
            will still be settled. Player runs / fall of wicket/Wicket lost to ball/How many ball face by player will be
            also settled at the figures where match gets stopped due to rain for the inning (D/L) , cancelled ,
            abandoned , no result.
          </p>
          <p className="para">
            5.12) If a player gets Retired Hurt and one ball is completed after you place your bets then all the betting
            till then is and will remain valid.
          </p>
          <p className="para">
            5.13) Should a Technical Glitch in Software occur, we will not be held responsible for any losses.
          </p>
          <p className="para">
            5.14) Should there be a power failure or a problem with the Internet connection at our end and session/fancy
            market does not get suspended then our decision on the outcome is final.
          </p>
          <p className="para">
            5.15) All decisions relating to settlement of wrong market being offered will be taken by management.
            Management will consider all actual facts and decision taken will be full in final.
          </p>
          <p className="para">
            5.16) Any bets which are deemed of being suspicious, including bets which have been placed from the stadium
            or from a source at the stadium maybe void at anytime. The decision of whether to void the particular bet in
            question or to void the entire market will remain at the discretion of Company. The final decision of
            whether bets are suspicious will be taken by Company and that decision will be full and final.
          </p>
          <p className="para">
            5.17) Any sort of cheating bet, any sort of Matching (Passing of funds), Court Siding (Ghaobaazi on
            commentary), Sharpening, Commission making is not allowed in Company, If any company User is caught in any
            of such act then all the funds belonging that account would be seized and confiscated. No argument or claim
            in that context would be entertained and the decision made by company management will stand as final
            authority.
          </p>
          <p className="para">
            5.18) If any case wrong rate has been given in fancy,that particular bets will be cancelled (Wrong
            Commentary).
          </p>
          <p className="para">
            5.19) In case customer make bets in wrong fancy we are not liable to delete, no changes will be made and
            bets will be considered as confirm bet.
          </p>
          <p className="para">
            5.20) any query regarding result or rate has to be contacted within 7 days from the event, query after 7
            days from the event will not be considered as valid.
          </p>
          <p className="para">
            5.21) The Rules Which we have added Regarding Cheating/Hedging/manipulation of Odds are ONLY for the Ones
            with Wrong Intensions Not for Genuine Clients.
          </p>
          <p className="para">
            5.22) Penalty Runs - Any Penalty Runs Awarded in the Match (In Any Running Fancy or ADV Fancy) Will Not be
            Counted While Settling in our Exchange.
          </p>
          <p className="para">
            5.23) Player Boundaries Fancy:- We will only consider Direct Fours and Sixes hit by BAT.
          </p>
          <p className="para">
            5.24) Bowler run session rule:- If Bowler Bowl 1.1 over,then valid(For Bowler 2 over runs session) If Bowler
            Bowl 2.1 over,then valid(For Bowler 3 over runs session) If Bowler Bowl 3.1 over,then valid(For Bowler 4
            over runs session) If Bowler Bowl 4.1 over,then valid(For Bowler 5 over runs session) If Bowler Bowl 9.1
            over,then valid(For Bowler 10 over runs session)
          </p>
          <p className="para">
            5.25) Any cricket event which is being held behind closed doors in that if any players found to be taking
            advantage of groundline in fancy bets in such cases bets can be void after the market ends. Company decision
            to be final.
          </p>
          <p className="para">
            5.26) Company reserves the right to suspend/void any id/bets if the same is found to be illegitimate. For
            example,In case of VPN/robot-use/multiple entry from same IP/ multiple bets at same time (Punching) and
            others. Note: - only winning bets will be voided, For example: If we find such entries (above mentioned)
            from any id and their bets are (200000 lay in a 6 over session for the rate 40 and 200000 back for the rate
            of 48) and the actual score is 38, bets of 40 lay will be voided and the bets for 48 back will be considered
            valid.
          </p>
          <p className="para">
            5.27) Odd-even rules:- Incomplete games will be deleted. Over reduced or abandoned all bets will be deleted.
          </p>
          <p className="para">5.28) In any circumstances company decision will be final.</p>
          <p className="para">
            5.29) If Users Found Betting In Group's then We Will Void "Only The Winning Bets of the Users" and Company
            Decision Will be Full and Final.
          </p>
          <p className="para">
            5.30) If Exchange resettle any bets or Markets due to wrong Result Declaration or any other reason & if the
            Player has lost Money or If Player gets Negative Balance, In this case Company will do the Settlement from
            Agent for the same, all decision will be Full And Final, No Arguments will be listened.
          </p>
          <p className="para">
            5.31) Company reserves the right to void any bets (only winning bets) of any event at any point of the match
            if the company believes there is any cheating/wrong doing in that particular event by the players (either
            batsman/bowler)
          </p>
          <p className="para">5.32) Our Exchange Is Trusted and Fair.</p>
          <b className="subpara">6) IPL RULES:-</b>
          <p className="para">
            6.1) If Over Reduced in Match, we will not count the actual scores of the Over Reduced Matches instead we
            will count the Market’s Average Scores.
          </p>
          <p className="para">
            6.2) If Match is Abandoned, we will not count the actual scores of the Abandoned Matches instead we will
            count the Market’s Average Scores. NOTE:-These rules are for the following Markets of ENTIRE IPL 2021 (60
            Matches):-
          </p>
          <p className="para">
            6.3) Total Fours: - Average 26 Fours will be given if the match is abandoned or over reduced.
          </p>
          <p className="para">
            6.4) Total Sixes: - Average 13 Sixes will be given if the match is abandoned or over reduced.
          </p>
          <p className="para">
            6.5) Total Wide: - Average 8 Wide’s will be given if the match is abandoned or over reduced.
          </p>
          <p className="para">
            6.6) Total Extras: - Average 14 Extras will be given if the match is abandoned or over reduced.
          </p>
          <p className="para">
            6.7) Total No Ball: - Average 1 No Ball will be given if the match is abandoned or over reduced.
          </p>
          <p className="para">
            6.8) Total Duck: - Average 1 Duck will be given if the match is abandoned or over reduced.
          </p>
          <p className="para">
            6.9) Total Fifties: - Average 2 Fifties will be given if the match is abandoned or over reduced.
          </p>
          <p className="para">
            6.10) Total Century: -Average 0 Century will be given if the match is abandoned or over reduced.
          </p>
          <p className="para">
            6.11) Total Run Out: - Average 1 Run Out will be given if the match is abandoned or over reduced.
          </p>
          <p className="para">
            6.12) Total Caught out: - Average 8 Caught Out will be given if the match is abandoned or over reduced.
          </p>
          <p className="para">
            6.13) Total Maiden Over: - Average 0 Maiden Over will be given if the match is abandoned or over reduced.
          </p>
          <p className="para">
            6.14) Total LBW: - Average 1 LBW will be given if the match is abandoned or over reduced.
          </p>
          <p className="para">
            6.15) Total Bowled: - Average 2 Bowled will be given if the match is abandoned or over reduced.
          </p>
          <p className="para">
            6.16) In case IPL Matches Gets Stopped or Interrupted Due to "COVID-19" or Any "ACT OF GOD" Reasons, under
            45 Matches then All IPL 2021 Tournament Fancy Markets will be Voided, but if 45 or Above Matches are Being
            Played then we will Settle all the Fancy Markets and Also If there are NON-Played Matches Above 45 then we
            will settle the markets as per our Markets Average.
          </p>
          <p className="para">
            6.17) If IPL 2021 gets stopped due to “Covid-19” or Any “Act of God” reason then We will wait till 45 days
            from the day IPL gets stopped, and if IPL Matches gets Resumed before 45th day then we will continue as
            Usual Score Countation but if IPL 2021 does not resume until 45th day then we will settle the markets
            according to our above-mentioned Markets Averages and In case of Void, We will Void the under 45 matches on
            45th day from the day IPL 2021 stopped.
          </p>
          <b className="subpara">7) Casino RULES:-</b>
          <p className="para">
            7.1) If Company voided any bet due to wrong rate or technical issue in casino games and the Player has lost
            Money or If Player gets Negative Balance, In this case Company will do the Settlement from Agent for the
            same, all decision will be Full And Final, No Arguments will be listened.
          </p>
          <p className="para">7.2) Exchange accept maximum bet as per below casino:</p>
          <div>
            <p className="para1">Evolution: 2,00,000 INR</p>
            <p className="para1">Pragmatic: 2,00,000 INR</p>
            <p className="para1">Bet Games: 2,00,000 INR</p>
            <p className="para1">Vivo: 2,00,000 INR</p>
          </div>
          <b className="subpara">8) Soccer RULES:-</b>
          <p className="para">
            8.1) Here comes the VAR verdict. NO GOAL for Ecuador due to an offside in the build-up play.
          </p>
          <b className="subpara">9) Lottery RULES:-</b>
          <p className="para">9.1) Lottery means Last Digit.</p>
          <p className="para">9.2) Completed Lottery Will be Settled, Incomplete Lottery Will be voided.</p>
          <p className="para">
            9.3) Example :- We will Count Last Digit of particular Lottery Market, if in 6 over Market the Score is 42,
            so we will settle that particular market @ 2.
          </p>
          <p className="para">9.4) In case of Rain or If Over Gets Reduced then this Market will get Voided.</p>
          <b className="subpara">10) Tennis RULES:-</b>
          <p className="para">
            10.1) In tennis if First set is not completed and the player is injured..and he does not play the
            game...then the opposite player will be given the winner...
          </p>
        </div>
      </>
    );
  }

  return (
    <AppDrawer showCarousel={false} isMobile={false}>
      <Layout />
      {getRules()}
    </AppDrawer>
  );
};

export default RulesPage;
