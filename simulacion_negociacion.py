
from transformers import GPTNeoForCausalLM, GPT2Tokenizer
import torch

# Cargar el tokenizer y el modelo GPT-Neo
tokenizer = GPT2Tokenizer.from_pretrained("EleutherAI/gpt-neo-1.3B")
model = GPTNeoForCausalLM.from_pretrained("EleutherAI/gpt-neo-1.3B")

# Mover el modelo a la GPU si está disponible
device = "cuda" if torch.cuda.is_available() else "cpu"
model.to(device)

# Función para generar texto
def generar_respuesta(contexto, max_length=100):
    inputs = tokenizer(contexto, return_tensors="pt").to(device)
    output = model.generate(
        inputs['input_ids'],
        max_length=max_length,
        num_return_sequences=1,
        do_sample=True,
        top_k=50,
        top_p=0.95,
        temperature=0.7
    )
    respuesta = tokenizer.decode(output[0], skip_special_tokens=True)
    return respuesta

class Negociacion:
    def __init__(self):
        self.estado = {
            "sindicato": {
                "moral": 15,
                "estrategia": 17,
                "oratoria": 13,
            },
            "empresa": {
                "presion_financiera": 10,
                "estrategia": 18,
                "negociacion": 15,
            }
        }

    def turno_sindicato(self):
        contexto = f"El sindicato tiene moral {self.estado['sindicato']['moral']} y estrategia {self.estado['sindicato']['estrategia']}. La empresa tiene presión financiera {self.estado['empresa']['presion_financiera']}."
        accion_sindicato = generar_respuesta(contexto)
        print(f"El sindicato dice: {accion_sindicato}")
    
    def turno_empresa(self):
        contexto = f"La empresa tiene presión financiera {self.estado['empresa']['presion_financiera']} y estrategia {self.estado['empresa']['estrategia']}. El sindicato tiene moral {self.estado['sindicato']['moral']}."
        accion_empresa = generar_respuesta(contexto)
        print(f"La empresa dice: {accion_empresa}")

    def ejecutar_negociacion(self):
        for turno in range(5):
            print(f"Turno {turno + 1}")
            self.turno_sindicato()
            self.turno_empresa()

if __name__ == "__main__":
    negociacion = Negociacion()
    negociacion.ejecutar_negociacion()
