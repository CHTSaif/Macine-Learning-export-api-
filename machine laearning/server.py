from flask import Flask, request, jsonify
import joblib
import pandas as pd
import numpy as np




from flask_cors import CORS  


app = Flask(__name__)


CORS(app)

# Charger le modèle pré-entrainé avec le préprocesseur
model_pipeline = joblib.load('svr_model_with_preprocessing.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Extraire les données de la requête
        data = request.get_json()

        # Créez un dictionnaire pour mapper les noms des colonnes
        input_data_dict = {
            'region': data['region'],
            'sector': data['sector'],
            'Value Added [M.EUR]': data['valueAdded'],
            'Employment [1000 p.]': data['employment'],
            'GHG emissions [kg CO2 eq.]': data['ghgEmissions'],
            'Energy Carrier Net Total [TJ]': data['energy'],
            'Year': data['year']
        }

        # Préparer les données reçues dans un DataFrame avec les colonnes nécessaires
        input_data = pd.DataFrame([input_data_dict])

        # Vérifiez les noms de colonnes du DataFrame pour déboguer
        print(input_data.columns)

        # Prédire en utilisant le modèle avec prétraitement
        prediction = model_pipeline.predict(input_data)

        # Retourner la prédiction sous forme de JSON
        return jsonify({'prediction': prediction[0]})

    except Exception as e:
        return jsonify({'error': str(e)})


# Lancer l'application Flask
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
