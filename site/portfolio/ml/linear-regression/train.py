import torch

# Illustrative example using synthetic data.
x = torch.linspace(-1, 1, 21).reshape(-1, 1)
y = 1.8 * x + 1
model = torch.nn.Linear(1, 1)
optimizer = torch.optim.SGD(model.parameters(), lr=0.1)

for _ in range(200):
    loss = ((model(x) - y) ** 2).mean()
    optimizer.zero_grad()
    loss.backward()
    optimizer.step()

print('Weight:', model.weight.item())
print('Bias:', model.bias.item())

