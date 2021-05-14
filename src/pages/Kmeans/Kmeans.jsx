import React, { Fragment, useState } from "react";
import { Upload } from "./KmeansAlgo.js";
import { Input } from 'antd';
import "./Kmeans.css";
import { Button } from 'antd';

const KmeansComp = () => {
   
    return (
    <Fragment>
        <div className="ho-main">
            <div style={{display: "inline-grid"}}>
                <input style={{margin:'5px'}} type="file" id="fileUpload" />
                <Input style={{margin:'5px', width:'auto'}} placeholder="Number of Clusters" id="noclusters"/>
                <Input style={{margin:'5px', width:'auto'}} placeholder="Number of Iterations" id="noiter"/>


            <Button id="upload" size="large" 
                style={{color:"black", borderColor:"black", margin: '5px'}} 
                onClick={()=>Upload()}>Upload</Button>
            
            </div>
            <div id="kmeans" className="kmeans-chart"></div>
        
            <div id="box" style={{display:"inline-grid"}}></div>
        </div>
    </Fragment>
    );
};

export default KmeansComp;
