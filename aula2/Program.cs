
string nome = "Eduardo";
int idade = 18;
double altura = 1.70;
decimal saldo = 250.00m;
bool matriculado = true;
char turma = 'b';
var cidade = "Torres";
const double pi = 3.14;

// Console.WriteLine($"Nome: {nome}");
// Console.WriteLine($"Idade: {idade}");
// Console.WriteLine($"Altura: {altura}");
// Console.WriteLine($"Saldo: {saldo}");
// Console.WriteLine($"Matriculado: {matriculado}");
// Console.WriteLine($"Turma: {turma}");
// Console.WriteLine($"Cidade: {cidade}");
// Console.WriteLine($"Pi: {pi}");

int x = 10;
double y;
y = x;

double w = 2.45;
int z = (int)w;

Convert.ToInt32(w);

Console.WriteLine("Informar seu nome: ");
string? nomeX = Console.ReadLine();

Console.WriteLine("Informar sua idade: ");
int idadeX = Convert.ToInt32(Console.ReadLine());

if (idadeX >= 18)
{
    Console.WriteLine("Você é maior de idade.");
}
else
{
    Console.WriteLine("Você é menor de idade.");
}

Console.WriteLine("Informar uma cor:\n1 - Vermelho\n2 - Azul\n3 - Verde");
int opc = Convert.ToInt32(Console.ReadLine());

switch (opc)
{
    case 1:
        Console.WriteLine("Você escolheu a cor Vermelho.");
        break;
    case 2:
        Console.WriteLine("Você escolheu a cor Azul.");
        break;
    case 3:
        Console.WriteLine("Você escolheu a cor Verde.");
        break;
    default:
        Console.WriteLine("Opção inválida.");
        break;
}

Console.Write("Valor da compra: R$ ");
string? entrada = Console.ReadLine();
decimal subtotal = Convert.ToDecimal(entrada);

decimal desc = 0m;

if (subtotal >= 500m)
{
    desc = 0.20m;
}
else if (subtotal >= 200m)
{
    desc = 0.10m;
}
else if (subtotal >= 100m)
{
    desc = 0.05m;
}

decimal total = subtotal - (subtotal * desc);

Console.WriteLine($"Desconto aplicado: {desc:P0}");
Console.WriteLine($"Total a pagar: R$ {total:F2}");