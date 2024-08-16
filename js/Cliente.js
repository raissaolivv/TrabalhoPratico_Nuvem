class Cliente {
    constructor(obj){
        obj = obj || {};
        this.id = obj.id
        this.nome = obj.nome;
        this.cpf = obj.cpf;
        this.dataNascimento = obj.dataNascimento;
        this.email = obj.email;
    }

    modeloValido(){
        return !!(this.nome && this.cpf && this.dataNascimento && this.email);
    }
}