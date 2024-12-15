import { Component, OnInit, VERSION, ViewChild, ViewEncapsulation } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { ApiService } from './api.service';


@Component({
    selector: 'example',
    templateUrl: './example.component.html',
    encapsulation: ViewEncapsulation.None
})
export class ExampleComponent  implements OnInit {


  region: string = '';
  sector: string = '';
  valueAdded: number | null = null;
  employment: number | null = null;
  ghgEmissions: number | null = null;
  energy: number | null = null;
  year: number | null = null;
  prediction: string | null = null;  // Ensure it's initialized to null or empty

  errorMessage: string = '';

  public barChartData: ChartData<'bar'> = {
    labels: ['Manufacture of basic iron and steel', 'Manufacture of glass', 'Cultivation of cereal grains'],
    datasets: [
      {
        data: [1280.707087, 550.695784, 163.511373],
        label: 'Value Added [M.EUR]',
        backgroundColor: '#FF8A80',
      }
    ]
  };

  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      x: { ticks: {
        font: {
          size: 14, // Adjust the font size of the x-axis labels
        },
      },
        title: { display: true, text: 'Sector' }
      },
      y: { ticks: {
        font: {
          size: 14, // Adjust the font size of the x-axis labels
        },
      },
        title: { display: true, text: 'Value Added [M.EUR]' }
      }
    },
    plugins: {
      legend: {
        labels: {
          font: {
            size: 16, // Adjust the font size of the legend labels
          },
        },
      },
    },
  };

  // Line Chart for Value Added & Employment Over Time (using Year)
  public lineChartData: ChartData<'line'> = {
    labels: ['1999', '2000', '2004', '2011', '2013'],
    datasets: [
      {
        data: [550.695784, 163.511373, 367.136033, 1280.707087, 3.908750], // Value Added
        label: 'Value Added [M.EUR]',
        borderColor: '#42A5F5',
        fill: false,
      },
      {
        data: [33.276307, 0.643118, 17.6, 8.115302, 0.182723], // Employment
        label: 'Employment [1000 p.]',
        borderColor: '#66BB6A',
        fill: false,
      }
    ]
  };

  public lineChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      x: {
        title: { display: true, text: 'Year' }
      },
      y: {
        title: { display: true, text: 'Value (M.EUR) / Employment (1000 p.)' }
      }
    },
  };

  // Pie Chart for GHG Emissions by Region
  public pieChartData: ChartData<'pie'> = {
    labels: ['BE', 'PL', 'PT'],
    datasets: [
      {
        data: [1.629271e+09, 7.761670e+08, 2.491203e+07],
        backgroundColor: ['#FF8A80', '#FFEB3B', '#66BB6A'],
      }
    ]
  };

  public pieChartOptions: ChartOptions = {
    responsive: true,
  };

  // Scatter Plot for Energy vs GHG Emissions
  public scatterChartData: ChartData<'scatter'> = {
    datasets: [{
      data: [
        { x: 25097.0, y: 1.629271e+09 },
        { x: 12961.0, y: 7.761670e+08 },
        { x: 833.0, y: 2.491203e+07 },
        { x: 13.0, y: 1.578600e+06 },
        { x: 1944.0, y: 2.476895e+08 },
      ],
      label: 'Energy vs GHG Emissions',
      borderColor: '#42A5F5',
      pointBackgroundColor: '#42A5F5',
    }]
  };

  public scatterChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      x: { title: { display: true, text: 'Energy Carrier Net Total [TJ]' } },
      y: { title: { display: true, text: 'GHG Emissions [kg CO2 eq.]' } },
    },
  };

  // Stacked Bar Chart for Employment and Energy by Region
  public stackedBarChartData: ChartData<'bar'> = {
    labels: ['BE', 'PL', 'PT'],
    datasets: [
      {
        data: [8.115302, 33.276307, 17.600000],
        label: 'Employment [1000 p.]',
        backgroundColor: '#FFEB3B',
      },
      {
        data: [25097.0, 12961.0, 833.0],
        label: 'Energy [TJ]',
        backgroundColor: '#66BB6A',
      }
    ]
  };

  public stackedBarChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      x: {
        title: { display: true, text: 'Region' }
      },
      y: {
        stacked: true,
        title: { display: true, text: 'Employment (1000 p.) & Energy (TJ)' }
      }
    },
  };

  
  constructor(private apiService: ApiService) {}
  ngOnInit(): void {
   
    
  }

  onSubmit(): void {
    if (this.isFormValid()) {
      const formData = {
        region: this.region,
        sector: this.sector,
        valueAdded: this.valueAdded,
        employment: this.employment,
        ghgEmissions: this.ghgEmissions,
        energy: this.energy,
        year: this.year
      };
  
      // Log the form data
      console.log('Sending data:', formData);
  
      fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })
      .then(response => response.json())
      .then(data => {
        console.log('API Response:', data); // Check if response is correct
  
        // Check if prediction is available in the response
        if (data.prediction) {
          this.prediction = `Prediction: ${data.prediction.toFixed(2)}`;
          console.log('Prediction set:', this.prediction); // Log when setting prediction
        } else if (data.error) {
          this.prediction = `Error: ${data.error}`;
          console.log('Error message:', this.prediction); // Log error message
        }
      })
      .catch(error => {
        this.prediction = `Error: ${error.message}`;
        console.log('Error caught:', error.message); // Log caught error
      });
    } else {
      this.prediction = 'Please fill in all fields.';
      console.log('Form is not valid'); // Log if form is invalid
    }
  }
  

  // Function to check if form is valid
  isFormValid(): boolean {
    return (
      this.region && this.sector && this.valueAdded !== null &&
      this.employment !== null && this.ghgEmissions !== null &&
      this.energy !== null && this.year !== null
    );
  }

}