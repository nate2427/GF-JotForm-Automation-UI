import './App.css';
import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Grid } from '@mui/material';
import { makeServer } from './mock_server/server';
import StickyHeadTable from './components/MUITable';
import DataTable from './components/MUIDataGrid';

// if (process.env.NODE_ENV === "development") {
//   makeServer({ environment: "development" })
// }

let host = "https://apple-pie-31742.herokuapp.com"

if (process.env.NODE_ENV === "development") {
  host = "http://127.0.0.1:5000/"
}


const CardBackgroundContainer = ({ children, mtSize, cardHeight }) => {
  return (
    <Card sx={{ overflow: 'scroll', maxHeight: "70vh", borderRadius: "10px", height: cardHeight, mt: mtSize, border: "1px solid rgb(19, 47, 76)", backgroundColor: "rgb(0, 30, 60)", p: 1 }}>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}


export function GFDatePicker({ cardWidth, setCampaignTitles }) {
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");

  return (
    <Card sx={{ borderRadius: "10px", height: '30vh', border: "1px solid rgb(19, 47, 76)", backgroundColor: "rgb(0, 30, 60)" }}>
      <CardContent>
        <Typography sx={{ fontSize: 32, textAlign: 'center' }} color="white" gutterBottom>
          Choose a Date Range
        </Typography>
        <Grid container sx={{ justifyContent: "space-between" }}>
          <Grid item xs={5} sx={{ border: "1px solid rgb(19, 47, 76)", backgroundColor: "rgb(0, 30, 60)" }}>
            <DatePicker
              label="Basic example"
              selected={startDate}
              onChange={(newValue) => {
                setStartDate(newValue);
              }}
              placeholderText="Select a start date"
              dateFormat={"yyyy/MM/dd"}
            />
            <CardActions>
              <Button onClick={() => {
                setStartDate("")
              }} size="small">Clear Start Date</Button>
            </CardActions>
          </Grid>
          <Grid xs={5} item sx={{ border: "1px solid rgb(19, 47, 76)", backgroundColor: "rgb(0, 30, 60)" }} >
            <DatePicker
              label="Basic example"
              selected={endDate}
              onChange={(newValue) => {
                setEndDate(newValue);
              }}
              dateFormat={"yyyy/MM/dd"}
              placeholderText="Select an end date"
            />
            <CardActions>
              <Button onClick={() => setEndDate("")} size="small">Clear End Date</Button>
            </CardActions>
          </Grid>
          {
            startDate && endDate && <Grid container sx={{ p: 2 }}>
              <Button onClick={() => {
                axios.post(`${host}/api/v1/get-date-range`, {
                  "start_date": startDate.toISOString().split('T')[0],
                  "end_date": endDate.toISOString().split('T')[0]
                }).then(res => {
                  setCampaignTitles(res.data)
                })
              }} fullWidth={true} variant="contained" color="primary" size="small"> Find Campaigns For This Date Range </Button>
            </Grid>
          }

        </Grid>
      </CardContent>
    </Card>
  );
}


const CampaignTitles = ({ campaignTitles, setOrganizedSubmissions }) => {

  return (
    <Grid container>
      {campaignTitles.length > 0 &&
        <Grid item xs={12}>
          <Typography variant="h5" component="h2" sx={{ fontSize: 32, color: "white", pb: 2, textAlign: 'center' }}>
            Campaigns Within This Date Range
          </Typography>
        </Grid>
      }
      {campaignTitles.length > 0 && <DataTable campaignTitles={campaignTitles} />}
      {campaignTitles.length > 0 &&
        <Grid item xs={12} sx={{ pt: 3 }}>
          <Button onClick={() => {
            axios.post(`${host}/api/v1/get-forms-and-submissions`, {
              "start_date": "2022-01-01",
              "end_date": "2022-01-01"
            }).then(res => {
              setOrganizedSubmissions(res.data)
            })
          }} fullWidth={true} variant="contained" color="primary" size="small"> Organize Submissions For Forms </Button>
        </Grid>}
    </Grid>
  )
}

const FormAndSubmissions = ({ title, submissions, order }) => {
  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="h5" component="h2" sx={{ fontSize: 32, color: "white", pt: order === 2 && 2, pb: 2, textAlign: "center" }}>
          {title}
        </Typography>
      </Grid>
      <Grid container>
        <StickyHeadTable submissions={submissions} />
      </Grid>
    </Grid >
  )
}

const OrganizedSubmissions = ({ organizedSubmissions, setDownloadLinks }) => {
  return (
    <Grid container>
      {organizedSubmissions['gf'] !== undefined && <FormAndSubmissions title="GF Google Form Submissions" submissions={organizedSubmissions['gf']} order={1} />}
      {organizedSubmissions['thrive'] !== undefined && <FormAndSubmissions title="Thrive Google Form Submissions" submissions={organizedSubmissions['thrive']} order={2} />}
      {organizedSubmissions['thrive'] !== undefined && <Grid item xs={12} sx={{ pt: 3 }}>
        <Button onClick={() => {
          axios.get(`${host}api/v1/get-download-links`, {
            "start_date": "2022-01-01",
            "end_date": "2022-01-01"
          }).then(res => {
            setDownloadLinks(res.data['files'])
          })
        }} fullWidth={true} variant="contained" color="primary" size="small"> Create Download Links </Button>
      </Grid>}
    </Grid>
  )
}

const DownloadXLFiles = ({ downloadLinks }) => {

  return (
    <Grid container>
      {downloadLinks.length > 0 &&
        <Grid item xs={12}>
          <Typography variant="h5" component="h2" sx={{ fontSize: 32, color: "white", pb: 2, textAlign: "center" }}>
            Download Files
          </Typography>
        </Grid>
      }
      {downloadLinks.length > 0 &&
        <Grid container spacing={2}>
          {downloadLinks.map((link, index) => {
            return (
              <Grid item xs={12} sm={6} key={index}>
                <Button style={{ height: '15vh' }} fullWidth={true} variant="contained" color="primary" size="small" onClick={() => {
                  axios.get(`${host}/${link}`, {
                    "start_date": "",
                    "end_date": ""
                  }).then(res => {
                    const a = document.createElement('a');
                    a.href = `${host}/${link}`;
                    a.download = res.data
                    a.click();

                  })
                }}>
                  {link}
                </Button>
              </Grid>
            )
          })}
        </Grid>
      }
    </Grid >

  )

}




function App() {

  const [campaignTitles, setCampaignTitles] = React.useState([]);
  const [organizedSubmissions, setOrganizedSubmissions] = React.useState({});
  const [downloadLinks, setDownloadLinks] = React.useState([]);

  return (
    <Grid container={true} spacing={2} sx={{ p: 2, justifyContent: "center", minHeight: "", backgroundColor: "#0A1929" }} >
      <Grid item xs={12} sm={10} md={5} >
        <GFDatePicker cardWidth={'30%'} setCampaignTitles={setCampaignTitles} />
        <CardBackgroundContainer cardHeight={'70vh'} mtSize={2}>
          <CampaignTitles
            campaignTitles={campaignTitles}
            setOrganizedSubmissions={setOrganizedSubmissions}
          />
        </CardBackgroundContainer>
      </Grid>
      <Grid item xs={12} sm={10} md={7}>
        <CardBackgroundContainer mtSize={0} cardHeight={'70vh'}>
          <OrganizedSubmissions organizedSubmissions={organizedSubmissions} setDownloadLinks={setDownloadLinks} />
        </CardBackgroundContainer>
        <CardBackgroundContainer mtSize={2} cardHeight={'30vh'} >
          <DownloadXLFiles downloadLinks={downloadLinks} />
        </CardBackgroundContainer>
      </Grid>
    </Grid>
  );
}

export default App;
