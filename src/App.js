import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

import { Layout } from "antd";

import './App.css';
//Pages
import KmeansComp from "./pages/Kmeans/Kmeans";


const { Header, Content } = Layout;


function App() {

  return (
    <div className="App">
      <Router>
        <Layout style={{ minHeight: "100vh" }}>
          
          <Layout className="site-layout">
            <Header
              className="site-layout-background"
              style={{ padding: 0, fontSize: "x-large", fontWeight: "700" }}
            >
              K-Means Clustering Visualization
            </Header>
            <Content
              className="site-layout-background"
              style={{
                margin: "24px 16px",
                minHeight: 280,
              }}
            >
             
             <KmeansComp/>
            </Content>
          </Layout>
        </Layout>
      </Router>
    
    </div>
  );
}

export default App;
