import React from 'react';

import Dropzone from 'react-dropzone'
import FaCloudUpload from 'react-icons/lib/fa/cloud-upload'
import FaHandORight from 'react-icons/lib/fa/hand-o-right'
import FaFileText from 'react-icons/lib/fa/file-text'
import Loader from './Loader.jsx';
import Grid from 'react-bootstrap/lib/Grid'
import Row from 'react-bootstrap/lib/Row'
import Col from 'react-bootstrap/lib/Col'
import Alert from 'react-bootstrap/lib/Alert'

import BenchmarkRun from '../models/BenchmarkRun.js';

export default class FileDrop extends React.Component {

    static propTypes = {
        examples: React.PropTypes.object.isRequired,
        uploadBenchmarkRunsFunction: React.PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            uploadBenchmarkRunsFunction: props.uploadBenchmarkRunsFunction,
            examples: props.examples,
            loading: false
        };
    }

    onDrop(files) {
        if (files.length > 2) {
            alert(`Maximum 2 files allowed to upload, but not ${files.length}!`)
            return
        }
        this.setState({
            loading: true
        });
        const benchmarkRuns = [];
        const uploadFunction = this.state.uploadBenchmarkRunsFunction;
        files.forEach((file, i) => {
            const reader = new FileReader();
            reader.onload = function(evt) {
                try {
                    var parsedBenchmarks = JSON.parse(evt.target.result);
                    const benchmarkRun = new BenchmarkRun({
                        name: file.name,
                        benchmarks: parsedBenchmarks
                    });
                    benchmarkRuns.push(benchmarkRun);
                    if (i == files.length - 1) {
                        uploadFunction(benchmarkRuns);
                    }
                } catch ( e ) {
                    alert(e); //error in the above string(in this case,yes)!
                }
            };
            reader.readAsText(file);
        });
    }

    onLoadSingleRunExample() {
        this.onLoadExample(this.state.examples.singleRunExample)
    }

    onLoadTwoRunsExample() {
        this.onLoadExample(this.state.examples.twoRunsExample)
    }

    onLoadExample(examples: BenchmarkRun[]) {
        if (!this.state.loading) {
            this.setState({
                loading: true
            });
            const uploadFunction = this.state.uploadBenchmarkRunsFunction;
            setTimeout(function() {
                uploadFunction(examples);
            }.bind(this), 450);
        }
    }

    render() {
        var uploadIcon;
        if (this.state.loading) {
            uploadIcon = <Loader/>
        } else {
            uploadIcon = <FaCloudUpload width={ 100 } height={ 100 } /> ;
        }

        return (
            <div>
              <Dropzone onDrop={ this.onDrop.bind(this) } multiple={ true } style={ { width: 400, height: 500, borderWidth: 2, borderColor: '#666', borderStyle: 'dashed', borderRadius: 5, display: 'table-cell', textAlign: 'center', verticalAlign: 'middle' } }>
                <div className="container">
                  <h2>Drop one or two of your JMH JSON file(s) here!</h2>
                </div>
                <h1>{ uploadIcon }</h1>
                <br/>
                <Alert bsStyle="warning">
                  <i>This tool visualizes <a href="http://openjdk.java.net/projects/code-tools/jmh/" target="_blank">JMH</a> benchmark results (in JSON format)! <br/>"JMH is a Java harness for building, running, and analysing nano/micro/milli/macro benchmarks written in Java and other languages targetting the JVM."</i>
                </Alert>
              </Dropzone>
              <div>
                <h2 style={ { textAlign: 'center' } }>Or load an Example:</h2>
                <br/>
                <Grid>
                  <Row className="show-grid">
                    <Col xs={ 6 } md={ 6 } style={ { textAlign: 'center' } }>
                    <FaHandORight/>
                    <span style={ { cursor: 'pointer' } } onClick={ this.onLoadSingleRunExample.bind(this) }><FaFileText width={ 70 } height={ 70 } /> Single Run</span>
                    </Col>
                    <Col xs={ 6 } md={ 6 } style={ { textAlign: 'center' } }>
                    <FaHandORight/>
                    <span style={ { cursor: 'pointer' } } onClick={ this.onLoadTwoRunsExample.bind(this) }><FaFileText width={ 70 } height={ 70 } /> <FaFileText width={ 70 } height={ 70 } /> Two Runs</span>
                    </Col>
                  </Row>
                </Grid>
              </div>
            </div>
        );
    }
}
