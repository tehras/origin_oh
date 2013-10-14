class ManagementsController < ApplicationController

  # GET /caretakers
  def index
    @user = User.all
    @caretaker = Caretaker.new
    @client = Client.new
  end

end
