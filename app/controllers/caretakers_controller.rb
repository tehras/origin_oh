class CaretakersController < ApplicationController

  before_action :set_caretaker, only: [:show, :edit, :update, :destroy]

  # GET /caretakers
  # GET /caretakers.json
  def index
    @caretakers = Caretaker.all
  end

  # GET /caretakers/1
  # GET /caretakers/1.json
  def show
  end

  # GET /caretakers/new
  def new
    @caretaker = Caretaker.new
  end

  # GET /caretakers/1/edit
  def edit
  end

  # POST /caretakers
  # POST /caretakers.json
  def create
    @caretaker = Caretaker.new(caretaker_params)

    respond_to do |format|
      if @caretaker.save
        format.html { redirect_to :back, notice: 'Caretaker was successfully created.' }
        format.json { render action: 'show', status: :created, location: @caretaker }
      else
        format.html { render action: 'new' }
        format.json { render json: @caretaker.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /caretakers/1
  # PATCH/PUT /caretakers/1.json
  def update
    respond_to do |format|
      if @caretaker.update(caretaker_params)
        format.html { redirect_to :back, notice: 'Caretaker was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @caretaker.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /caretakers/1
  # DELETE /caretakers/1.json
  def destroy
    @caretaker.destroy
    respond_to do |format|
      format.html { redirect_to :back}
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_caretaker
      @caretaker = Caretaker.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def caretaker_params
      params.require(:caretaker).permit(:first_name, :last_name, :email, :age, :nationality, :comment, :citizen, :car, :driver_license, :english)
    end
end
