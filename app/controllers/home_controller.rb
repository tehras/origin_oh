class HomeController < ApplicationController
  def index
    @users = User.all
    @url_link = root_path;
  end
end
